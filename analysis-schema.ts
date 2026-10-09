import { z } from 'zod'

const metricSchema = z.object({
  score: z
    .number()
    .describe('Integer 0-100. Higher means MORE environmental stress / risk for this metric.'),
  status: z.enum(['nominal', 'elevated', 'severe', 'critical']),
  finding: z
    .string()
    .describe('One or two sentences citing the concrete visual or textual evidence behind the score.'),
})

const forecastSchema = z.object({
  riskScore: z.number().describe('Projected composite risk score 0-100 at this horizon.'),
  headline: z.string().describe('Short headline (max ~8 words) for the projected state.'),
  drivers: z.array(z.string()).describe('2-3 concise primary drivers of the projection.'),
})

export const analysisSchema = z.object({
  riskScore: z.number().describe('Composite environmental risk score, integer 0-100.'),
  riskLevel: z.enum(['low', 'moderate', 'high', 'critical']),
  confidence: z
    .number()
    .describe('Analyst confidence 0-100, reduced when imagery is ambiguous or the report is sparse.'),
  summary: z.string().describe('Executive synthesis in 2-3 sentences.'),
  primaryHazard: z
    .string()
    .describe('Dominant hazard class, e.g. "Wildfire ignition", "Drought stress", "Landslide".'),
  metrics: z.object({
    vegetationHealth: metricSchema,
    moistureDeficit: metricSchema,
    humanEncroachment: metricSchema,
  }),
  timeline: z.object({
    day30: forecastSchema,
    day60: forecastSchema,
    day90: forecastSchema,
  }),
  recommendations: z.array(z.string()).describe('3-4 prioritized, actionable mitigation steps.'),
})

export type Analysis = z.infer<typeof analysisSchema>
export type MetricKey = keyof Analysis['metrics']
