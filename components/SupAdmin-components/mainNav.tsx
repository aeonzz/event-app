'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation";
import { adminNav } from "@/constants";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith('/admin') && (
        <nav
          className={cn("flex items-center space-x-4",
            className
          )}
          {...props}
        >
          {adminNav.map((item) => (
            <Link
              key={item.title}
              href={item.link}
              className={cn(
                pathname === item.link
                  ? "text-xs underline-offset-4 underline font-medium transition-colors"
                  : "text-xs font-medium text-accent-foreground transition-colors underline-offset-4 hover:underline",
                "justify-start"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}