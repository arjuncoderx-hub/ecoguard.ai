'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCEPTED = ['image/png', 'image/jpeg']
const MAX_BYTES = 10 * 1024 * 1024

export function ImageDropzone({
  id,
  file,
  onChange,
  disabled,
}: {
  id: string
  file: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function accept(candidate: File | undefined) {
    if (!candidate) return
    if (!ACCEPTED.includes(candidate.type)) {
      setError('Unsupported format. Use PNG or JPG.')
      return
    }
    if (candidate.size > MAX_BYTES) {
      setError('File exceeds 10 MB.')
      return
    }
    setError(null)
    onChange(candidate)
  }

  if (file && previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-md border border-border bg-background">
        <img
          src={previewUrl || '/placeholder.svg'}
          alt={`Uploaded satellite imagery: ${file.name}`}
          className="aspect-video w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 border-2 border-primary/30" aria-hidden="true" />
        <div className="flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2 font-mono text-[11px]">
          <span className="truncate text-muted-foreground">
            {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
          <button
            type="button"
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            disabled={disabled}
            className="flex items-center gap-1 text-muted-foreground hover:text-destructive disabled:opacity-50"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!disabled) accept(e.dataTransfer.files[0])
        }}
        className={cn(
          'flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background/60 p-6 text-center transition-colors',
          'hover:border-primary/60 hover:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
          dragging && 'border-primary bg-primary/10',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <div className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
          <ImageUp className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Drop imagery or click to browse</span>
          <span className="font-mono text-[11px] text-muted-foreground">PNG · JPG · max 10 MB</span>
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </label>
      {error && (
        <p role="alert" className="mt-2 font-mono text-[11px] text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
