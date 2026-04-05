/**
 * BlogBuilder with Default Components
 *
 * This is a convenience wrapper that provides default implementations
 * for all required UI components, making integration easier.
 *
 * For custom styling, you can either:
 * 1. Use this component and override styles with Tailwind
 * 2. Use the base BlogBuilder and pass your own shadcn/ui components
 *
 * @example
 * ```tsx
 * import { BlogBuilderWithDefaults } from 'm14i-blogging';
 *
 * function MyEditor() {
 *   const [sections, setSections] = useState([]);
 *
 *   return (
 *     <BlogBuilderWithDefaults
 *       sections={sections}
 *       onChange={setSections}
 *     />
 *   );
 * }
 * ```
 */

"use client";

import React from "react";
import { BlogBuilder } from "./BlogBuilder";
import { Plus, X } from "lucide-react";
import type { BlogBuilderProps } from "./BlogBuilder";

// Default Button component
function Button({
  variant = "default",
  size = "default",
  className = "",
  onClick,
  children,
  ...props
}: {
  variant?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

// Default Card components
function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
}

function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

// Default Label component
function Label({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
}

// Default Input component
function Input({ className = "", ...props }: { className?: string; [key: string]: any }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// Default Textarea component
function Textarea({ className = "", ...props }: { className?: string; [key: string]: any }) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// Default Select components
function Select({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div className="relative" {...props}>{children}</div>;
}

function SelectTrigger({ className = "", children, ...props }: { className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SelectValue({ placeholder, ...props }: { placeholder?: string; [key: string]: any }) {
  return <span {...props}>{placeholder}</span>;
}

function SelectContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${className}`}>
      {children}
    </div>
  );
}

function SelectItem({ className = "", children, ...props }: { className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Default components configuration
const defaultComponents = {
  Button,
  Card,
  CardHeader,
  CardContent,
  Label,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  PlusIcon: Plus,
  XIcon: X,
};

/**
 * BlogBuilder with default components pre-configured
 * No need to pass shadcn/ui components - just works out of the box!
 */
export function BlogBuilderWithDefaults({
  sections,
  onChange,
  config,
}: Omit<BlogBuilderProps, "components">) {
  return (
    <BlogBuilder
      sections={sections}
      onChange={onChange}
      config={config}
      components={defaultComponents}
    />
  );
}
