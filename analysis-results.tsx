import { Building2, Droplets, Leaf, ShieldCheck } from 'lucide-react'
import type { Analysis } from '@/lib/analysis-schema'
import { MetricCard } from './metric-card'
import { PredictiveTimeline } from './predictive-timeline'
import { RiskGauge } from './risk-gauge'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">{children}</h3>
}

export function AnalysisResults({ data }: { data: Analysis }) {
  const { metrics } = data

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[220px_1fr]">
        <RiskGauge score={data.riskScore} level={data.riskLevel} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-[11px] tracking-wider uppercase">
              Hazard: <span className="text-foreground">{data.primaryHazard}</span>
            </span>
            <span className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Confidence: <span className="text-primary">{data.confidence}%</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-pretty">{data.summary}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Indicator Matrix</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard label="Vegetation Health" icon={Leaf} {...metrics.vegetationHealth} />
          <MetricCard label="Moisture Deficit" icon={Droplets} {...metrics.moistureDeficit} />
          <MetricCard label="Human Encroachment" icon={Building2} {...metrics.humanEncroachment} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Predictive Timeline · 30 / 60 / 90 Days</SectionLabel>
        <PredictiveTimeline current={data.riskScore} timeline={data.timeline} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel>Mitigation Protocol</SectionLabel>
        <ol className="flex flex-col gap-2">
          {data.recommendations.map((r, i) => (
            <li key={r} className="flex gap-3 rounded-md border border-border bg-background/60 p-3 text-sm leading-relaxed">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary/15 font-mono text-[11px] text-primary">
                {i + 1}
              </span>
              <span className="text-pretty">{r}</span>
            </li>
          ))}
        </ol>
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          AI-generated assessment. Validate with field survey before operational decisions.
        </p>
      </div>
    </div>
  )
}
