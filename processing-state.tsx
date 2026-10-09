'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAGES = [
  'Processing spectral bands...',
  'Deriving vegetation index proxies...',
  'Parsing meteorological telemetry...',
  'Correlating geological substrate...',
  'Modeling encroachment vectors...',
  'Synthesizing composite risk...',
]

export function ProcessingState() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1))
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const progress = Math.round(((stage + 1) / (STAGES.length + 1)) * 100)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
      <div className="relative size-40 overflow-hidden rounded-full border border-primary/30 bg-background">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="animate-scan absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-primary/40 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-semibold text-primary tabular-nums">{progress}%</span>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Fusing</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-mono text-sm text-primary">{STAGES[stage]}</p>
        <p className="text-xs text-muted-foreground">GPT-4o multimodal inference in progress</p>
      </div>

      <ol className="flex w-full max-w-sm flex-col gap-2">
        {STAGES.map((label, i) => (
          <li
            key={label}
            className={cn(
              'flex items-center gap-3 font-mono text-xs',
              i < stage && 'text-muted-foreground',
              i === stage && 'text-foreground',
              i > stage && 'text-muted-foreground/40',
            )}
          >
            <span className="flex size-4 items-center justify-center">
              {i < stage ? (
                <Check className="size-3.5 text-primary" aria-hidden="true" />
              ) : i === stage ? (
                <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              )}
            </span>
            {label}
          </li>
        ))}
      </ol>
    </div>
  )
}
