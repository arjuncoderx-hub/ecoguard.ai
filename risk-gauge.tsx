import { cn } from '@/lib/utils'
import { toneForScore, toneStroke, toneText } from '@/lib/risk'

const SIZE = 220
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_FRACTION = 0.75
const ARC_LENGTH = CIRCUMFERENCE * ARC_FRACTION

export function RiskGauge({ score, level }: { score: number; level: string }) {
  const tone = toneForScore(score)
  const filled = (score / 100) * ARC_LENGTH
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10)

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[220px]"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      aria-label={`Composite risk score ${score} of 100, ${level}`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full rotate-[135deg]" aria-hidden="true">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
          className="stroke-muted"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          className={cn(toneStroke[tone], toneText[tone], 'transition-[stroke-dasharray] duration-1000 ease-out')}
          style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
        />
        {ticks.map((t) => {
          const angle = (t / 100) * ARC_FRACTION * 2 * Math.PI
          const inner = RADIUS - STROKE - 4
          const outer = RADIUS - STROKE + 2
          return (
            <line
              key={t}
              x1={SIZE / 2 + inner * Math.cos(angle)}
              y1={SIZE / 2 + inner * Math.sin(angle)}
              x2={SIZE / 2 + outer * Math.cos(angle)}
              y2={SIZE / 2 + outer * Math.sin(angle)}
              strokeWidth={1.5}
              className="stroke-muted-foreground/50"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Risk Index</span>
        <span className={cn('font-mono text-6xl font-semibold tabular-nums', toneText[tone])}>{score}</span>
        <span className={cn('font-mono text-xs tracking-widest uppercase', toneText[tone])}>{level}</span>
      </div>
    </div>
  )
}
