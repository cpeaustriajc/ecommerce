import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, children, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto w-full", className)}
      {...props}
    >
      {/* horizontal scroll wrapper for small screens */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    </nav>
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        // inline-flex so the list can be scrolled horizontally inside the wrapper
        "inline-flex items-center gap-2 px-2",
        className,
      )}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "default",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
  "min-w-[2.25rem] h-9 flex items-center justify-center",
  className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
  className={cn("gap-1 px-2.5 sm:pl-2.5", "sm:gap-2", className)}
      {...props}
    >
  <ChevronLeftIcon />
  <span className="sr-only sm:not-sr-only sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
        className={cn("gap-1 px-2.5 sm:pr-2.5", "sm:gap-2", className)}
      {...props}
    >
  <span className="sr-only sm:not-sr-only sm:block">Next</span>
  <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
  className={cn("flex w-9 h-9 items-center justify-center sm:w-11 sm:h-11", className)}
      {...props}
    >
  <MoreHorizontalIcon className="w-4 h-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

type LaravelLink = { url: string | null; label: string; active: boolean }

export function PaginationFromLaravel({
  links,
  onNavigate,
  className,
}: {
  links: LaravelLink[]
  onNavigate?: (url: string | null) => void
  className?: string
}) {
  const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '')

  const prev = links[0]
  const next = links[links.length - 1]
  const centerLinks = links.slice(1, links.length - 1)

  const decodeHtml = (str: string) => {
    if (typeof document !== 'undefined') {
      const txt = document.createElement('textarea')
      txt.innerHTML = str
      return txt.value
    }

    return str
      .replace(/&laquo;/g, '«')
      .replace(/&raquo;/g, '»')
      .replace(/&hellip;/g, '…')
      .replace(/&nbsp;/g, ' ')
  }

  return (
    <Pagination className={className}>
      <div className="relative w-full flex items-center">
        <div className="z-20 flex-shrink-0">
          {prev ? (
            <PaginationLink
              href={prev.url ?? '#'}
              isActive={false}
              onClick={(e) => {
                if (!prev.url) {
                  e.preventDefault()
                  return
                }
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate(prev.url)
                }
              }}
            >
              <ChevronLeftIcon />
              <span className="sr-only sm:not-sr-only sm:block">Previous</span>
            </PaginationLink>
          ) : (
            <PaginationLink href="#" isActive={false} onClick={(e) => e.preventDefault()} />
          )}
        </div>

        <div className="mx-2 flex-1 overflow-x-auto">
          <div className="min-w-full">
            <PaginationContent className="w-max">
              {centerLinks.map((l, i) => {
                const withoutTags = stripHtml(l.label)
                const label = decodeHtml(withoutTags)

                if (label === '...') {
                  return (
                    <PaginationItem key={i}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={l.url ?? '#'}
                      isActive={l.active}
                      onClick={(e) => {
                        if (!l.url) {
                          e.preventDefault()
                          return
                        }
                        if (onNavigate) {
                          e.preventDefault()
                          onNavigate(l.url)
                        }
                      }}
                    >
                      {label}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
            </PaginationContent>
          </div>
        </div>

        {/* Next - stays visible */}
        <div className="z-20 flex-shrink-0">
          {next ? (
            <PaginationLink
              href={next.url ?? '#'}
              isActive={false}
              onClick={(e) => {
                if (!next.url) {
                  e.preventDefault()
                  return
                }
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate(next.url)
                }
              }}
            >
              <span className="sr-only sm:not-sr-only sm:block">Next</span>
              <ChevronRightIcon />
            </PaginationLink>
          ) : (
            <PaginationLink href="#" isActive={false} onClick={(e) => e.preventDefault()} />
          )}
        </div>

        <div className="pointer-events-none absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-white/100 to-transparent dark:from-slate-900/100" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-white/100 to-transparent dark:from-slate-900/100" />
      </div>
    </Pagination>
  )
}
