import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Panel({
  title,
  code,
  action,
  children,
  className,
}: {
  title: string
  code: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      aria-label={title}
      className={cn('flex flex-col rounded-lg border border-border bg-card/80 backdrop-blur', className)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-primary">{code}</span>
          <h2 className="text-sm font-medium tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </section>
  )
}
