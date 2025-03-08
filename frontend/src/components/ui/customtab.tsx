"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/utils/shardcn.utils"

const CustomTabs = TabsPrimitive.Root

const CustomTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex space-x-6 border-b border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  />
))
CustomTabsList.displayName = TabsPrimitive.List.displayName

const CustomTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 " +
      "data-[state=active]:text-gray-900 data-[state=active]:dark:text-gray-50 " +
      "transition-colors duration-200 " +
      "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 " +
      "data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 " +
      "data-[state=active]:after:bg-blue-500 data-[state=active]:after:rounded-full",
      className
    )}
    {...props}
  />
))
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const CustomTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4  focus:ring-offset-2",
      className
    )}
    {...props}
  />
))
CustomTabsContent.displayName = TabsPrimitive.Content.displayName

export { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent }