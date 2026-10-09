import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Analysis } from '@/lib/analysis-schema'
import { cn } from '@/lib/utils'
import { toneBg, toneBorder, toneForScore, toneText } from '@/lib/risk'

export function PredictiveTimeline({ current, timeline }: { current: number; timeline: Analysis['timeline'] }) {
  const points = [
    { days: 30, ...timeline.day30 },
    { days: 60, ...timeline.day60 },
    { days: 90, ...timeline.day90 },
  ]

  return (
    <div className="relative">
      <div
        className="absolute top-[11px] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-border via-primary/40 to-border md:block"
        aria-hidden="true"
      />
    <ol className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
      {points.map((p, i) => {
        const prev = i === 0 ? current : points[i - 1].riskScore
        const delta = p.riskScore - prev
        const tone = toneForScore(p.riskScore)
        const Trend = delta > 2 ? ArrowUpRight : delta < -2 ? ArrowDownRight : ArrowRight

        return (
          <li key={p.days} className="relative flex flex-col items-stretch gap-3">
            <div className="flex items-center gap-2 md:flex-col md:gap-1">
              <span className={cn('relative z-10 size-[22px] rounded-full border-4 border-card', toneBg[tone])} aria-hidden="true" />
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">T+{p.days}d</span>
            </div>

            <div className={cn('flex flex-1 flex-col gap-3 rounded-md border bg-background/60 p-4', toneBorder[tone])}>
              <div className="flex items-center justify-between gap-2">
                <span className={cn('font-mono text-2xl font-semibold tabular-nums', toneText[tone])}>
                  {p.riskScore}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-0.5 font-mono text-xs tabular-nums',
                    delta > 2 ? 'text-destructive' : delta < -2 ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  <Trend className="size-3.5" aria-hidden="true" />
                  {delta > 0 ? '+' : ''}
                  {delta}
                  <span className="sr-only"> change from previous horizon</span>
                </span>
              </div>
              <p className="text-sm font-medium leading-snug text-balance">{p.headline}</p>
              <ul className="flex flex-col gap-1.5">
                {p.drivers.map((d) => (
                  <li key={d} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
    </div>
  )
}
