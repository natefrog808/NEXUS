// src/components/ui/tabs.jsx
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Base Tabs component
const Tabs = React.forwardRef(({ className, defaultValue, onValueChange, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    defaultValue={defaultValue}
    onValueChange={onValueChange}
    className={cn("flex flex-col gap-4", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

// TabsList component with neon styling and animation
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-lg bg-gray-900/80 p-1.5 shadow-lg",
      "border border-gray-700/50 backdrop-blur-sm",
      "transition-all duration-300 ease-in-out",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// TabsTrigger component with glitchy hover and active effects
const TabsTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium",
      "text-gray-300 bg-gray-800/50 border border-transparent",
      "transition-all duration-200 ease-in-out",
      "hover:bg-gray-700/70 hover:text-gray-100 hover:border-gray-600 hover:shadow-[0_0_8px_rgba(138,43,226,0.5)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
      "data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:border-purple-500",
      "data-[state=active]:shadow-[0_0_12px_rgba(138,43,226,0.7)]",
      "disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
      "relative overflow-hidden",
      // Glitch effect layer
      "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/20 before:to-transparent",
      "before:transform before:-translate-x-full before:transition-transform before:duration-500",
      "hover:before:translate-x-full",
      className
    )}
    {...props}
  >
    {children}
    <span className="absolute inset-0 pointer-events-none" aria-hidden="true" />
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// TabsContent component with fade-in animation and panel styling
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 rounded-lg bg-gray-900/90 border border-gray-700/50 p-4 shadow-xl",
      "transition-all duration-300 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
      "data-[state=active]:animate-in data-[state=active]:fade-in data-[state=inactive]:animate-out data-[state=inactive]:fade-out",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Utility to merge class names (if not already defined in @/lib/utils)
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
