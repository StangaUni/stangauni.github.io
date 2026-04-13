interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

const VARIANTS = {
  primary:   'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border border-border',
  outline:   'border border-border text-muted-foreground',
}

export function Badge({ variant = 'secondary', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold font-mono ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  )
}
