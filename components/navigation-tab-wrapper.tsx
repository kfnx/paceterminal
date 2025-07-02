"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { NavigationTabs } from '@/components/navigation-tabs'

export const NavigationTabWrapper = ({ className }: { className?: string }) => {
  const [menuState, setMenuState] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className={cn("fixed left-[5%] right-0 top-0 z-20 mx-auto w-[560px]", className)}>
        <div className={cn('mx-auto mt-2 max-w-5xl p-4 transition-all duration-300', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl p-2 backdrop-blur-lg')}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0">
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex shadow-2xl shadow-zinc-300/20 mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 dark:shadow-none md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:bg-transparent">
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <NavigationTabs />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
