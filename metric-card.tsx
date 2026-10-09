import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toneBg, toneForScore, toneText } from '@/lib/risk'

export function MetricCard({
  label,
  icon: Icon,
  score,
  status,
  finding,
}: {
  label: string
  icon: LucideIcon
  score: number
  status: string
  finding: string
}) {
  const tone = toneForScore(score)

  return (
    <article className="flex flex-col gap-3 rounded-md border border-border bg-background/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          <h3 className="text-xs font-medium tracking-tight">{label}</h3>
        </div>
        <span className={cn('font-mono text-[10px] tracking-wider uppercase', toneText[tone])}>{status}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={cn('font-mono text-3xl font-semibold tabular-nums', toneText[tone])}>{score}</span>
        <span className="font-mono text-xs text-muted-foreground">/100 stress</span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-label={`${label} stress`}
      >
        <div className={cn('h-full rounded-full transition-all duration-1000', toneBg[tone])} style={{ width: `${score}%` }} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{finding}</p>
    </article>
  )
}
