import type React from "react"
import { cn } from "@/utils/shardcn" 
import type { LucideIcon } from "lucide-react"

interface BentoCardProps {
  Icon: LucideIcon
  name: string
  description: string
  href: string
  className?: string
}

export function BentoCard({ Icon, name, description, href, className }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border dark:bg-[#1d232fcc] p-6 transition-all hover:shadow-md hover:scale-105",
        className,
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold tracking-tight">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function BentoGrid({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto grid w-full max-w-5xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {children}
    </div>
  )
}

