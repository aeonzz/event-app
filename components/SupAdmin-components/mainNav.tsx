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
                  ? "text-sm text-primary font-medium transition-colors"
                  : "text-sm font-medium text-accent-foreground transition-colors hover:text-primary",
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