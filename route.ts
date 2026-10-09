import { generateText, Output } from 'ai'
import { analysisSchema, type Analysis } from '@/lib/analysis-schema'

export const maxDuration = 60

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_REPORT_CHARS = 8000
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg'])

const SYSTEM_PROMPT = `You are EcoGuard, a senior geospatial intelligence analyst and environmental risk scientist with expertise in remote sensing (multispectral/RGB satellite interpretation, NDVI-proxy reasoning, land-cover classification), hydrometeorology, geomorphology, and wildland-urban interface risk.

TASK: Perform a multimodal risk synthesis by fusing (1) the supplied satellite image and (2) the meteorological/geological field report. Produce ONLY the structured JSON required by the schema.

ANALYTICAL RULES:
- Ground every claim in observable evidence: canopy density and color, bare soil exposure, water body extent, burn scars, drainage patterns, slope cues, road networks, structures, and agricultural boundaries in the image; precipitation, temperature, wind, soil moisture, seismic, and lithology data in the report.
- When the image and report disagree, weight the more specific, quantitative source and reduce confidence accordingly.
- If the image is not a plausible aerial/satellite scene, or the report is irrelevant, still return valid JSON but set confidence below 25 and state the limitation in the summary.
- All scores are integers 0-100 where higher = greater risk/stress. vegetationHealth score represents vegetation STRESS (100 = dead/absent vegetation).
- status mapping: 0-34 nominal, 35-59 elevated, 60-79 severe, 80-100 critical. riskLevel mapping: 0-29 low, 30-54 moderate, 55-74 high, 75-100 critical.
- Forecasts at 30/60/90 days must be causally consistent with current drivers and seasonal trajectories described in the report; do not invent unrelated events.
- Recommendations must be specific, actionable, and ordered by priority.
- Be precise and terse. No speculation beyond the evidence. No markdown.`

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

function normalize(a: Analysis): Analysis {
  const m = a.metrics
  const t = a.timeline
  return {
    ...a,
    riskScore: clamp(a.riskScore),
    confidence: clamp(a.confidence),
    metrics: {
      vegetationHealth: { ...m.vegetationHealth, score: clamp(m.vegetationHealth.score) },
      moistureDeficit: { ...m.moistureDeficit, score: clamp(m.moistureDeficit.score) },
      humanEncroachment: { ...m.humanEncroachment, score: clamp(m.humanEncroachment.score) },
    },
    timeline: {
      day30: { ...t.day30, riskScore: clamp(t.day30.riskScore) },
      day60: { ...t.day60, riskScore: clamp(t.day60.riskScore) },
      day90: { ...t.day90, riskScore: clamp(t.day90.riskScore) },
    },
  }
}

export async function POST(req: Request) {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'Expected multipart/form-data payload.' }, { status: 400 })
  }

  const image = form.get('image')
  const report = form.get('report')

  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ error: 'A satellite image (PNG/JPG) is required.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(image.type)) {
    return Response.json({ error: 'Only PNG or JPG imagery is supported.' }, { status: 415 })
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: 'Image exceeds the 10 MB limit.' }, { status: 413 })
  }
  if (typeof report !== 'string' || report.trim().length < 10) {
    return Response.json(
      { error: 'A meteorological / geological report of at least 10 characters is required.' },
      { status: 400 },
    )
  }

  const reportText = report.trim().slice(0, MAX_REPORT_CHARS)
  const imageBytes = new Uint8Array(await image.arrayBuffer())

  try {
    const { output } = await generateText({
      model: 'openai/gpt-4o',
      system: SYSTEM_PROMPT,
      temperature: 0.2,
      output: Output.object({ schema: analysisSchema }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `METEOROLOGICAL / GEOLOGICAL FIELD REPORT:\n"""\n${reportText}\n"""\n\nAnalyze the attached satellite imagery together with this report and return the risk synthesis.`,
            },
            { type: 'file', mediaType: image.type, data: imageBytes },
          ],
        },
      ],
    })

    return Response.json(normalize(output))
  } catch (error) {
    console.error('[ecoguard] analysis failed:', error)
    const statusCode = (error as { statusCode?: number })?.statusCode
    const message =
      statusCode === 403
        ? 'AI Gateway access is not enabled for this Vercel team. Add a payment method in the Vercel AI Gateway settings to unlock model access.'
        : statusCode === 429
          ? 'Rate limit reached on the inference gateway. Retry in a moment.'
          : 'Risk synthesis failed. The model could not produce a valid analysis.'
    return Response.json({ error: message }, { status: 502 })
  }
}
