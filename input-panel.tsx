'use client'

import { useState } from 'react'
import { Cpu, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageDropzone } from './image-dropzone'
import { Panel } from './panel'

const SAMPLE_REPORT = `Station: Ridge Valley AWS-14 | Period: last 21 days
Precipitation: 4.2 mm (82% below seasonal normal). No measurable rain in 16 days.
Temperature: daily max avg 36.8°C, 3 days exceeding 40°C. Relative humidity min 9%.
Wind: sustained SW 18-25 km/h, gusts to 52 km/h forecast next 10 days.
Soil moisture (0-30cm): 11% VWC, down from 24% one month ago.
Geology: weathered granite slopes 20-35°, thin colluvial cover; minor rockfall reported on access road.
Notes: new residential subdivision and logging access roads extending into eastern forest margin.`

const MAX_REPORT_CHARS = 8000

export function InputPanel({
  onSubmit,
  isLoading,
}: {
  onSubmit: (image: File, report: string) => void
  isLoading: boolean
}) {
  const [image, setImage] = useState<File | null>(null)
  const [report, setReport] = useState('')

  const canSubmit = !!image && report.trim().length >= 10 && !isLoading

  return (
    <Panel title="Data Ingestion" code="[01]" className="lg:sticky lg:top-6 lg:self-start">
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit && image) onSubmit(image, report)
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="satellite-image" className="font-mono text-xs tracking-wider uppercase">
            Satellite Imagery Feed (PNG/JPG)
          </Label>
          <ImageDropzone id="satellite-image" file={image} onChange={setImage} disabled={isLoading} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="report" className="font-mono text-xs tracking-wider uppercase">
              Meteorological / Geological Text Report
            </Label>
            <button
              type="button"
              onClick={() => setReport(SAMPLE_REPORT)}
              disabled={isLoading}
              className="font-mono text-[11px] text-primary underline-offset-4 hover:underline disabled:opacity-50"
            >
              Load sample
            </button>
          </div>
          <Textarea
            id="report"
            value={report}
            onChange={(e) => setReport(e.target.value.slice(0, MAX_REPORT_CHARS))}
            disabled={isLoading}
            placeholder="Paste station telemetry, precipitation anomalies, soil moisture, seismic notes, slope lithology..."
            className="min-h-48 resize-y bg-background/60 font-mono text-xs leading-relaxed"
            aria-describedby="report-count"
          />
          <p id="report-count" className="text-right font-mono text-[11px] text-muted-foreground">
            {report.length.toLocaleString()} / {MAX_REPORT_CHARS.toLocaleString()} chars
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="h-12 w-full gap-2 text-sm font-semibold tracking-wide shadow-[0_0_24px_-6px] shadow-primary/60"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Cpu className="size-4" aria-hidden="true" />
          )}
          {isLoading ? 'Synthesizing...' : 'Execute Multimodal Risk Synthesis'}
        </Button>
      </form>
    </Panel>
  )
}
