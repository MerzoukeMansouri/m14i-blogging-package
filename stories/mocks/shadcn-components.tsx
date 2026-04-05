import React from "react";

// Mock shadcn/ui components for Storybook
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps): React.ReactElement {
  return (
    <button
      className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
      {...props}
    >
      {children}
    </button>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className="flex flex-col space-y-1.5 p-6"
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }: CardProps): React.ReactElement {
  return (
    <div
      className="p-6 pt-0"
      {...props}
    >
      {children}
    </div>
  );
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, ...props }: LabelProps): React.ReactElement {
  return (
    <label
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      {...props}
    >
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>): React.ReactElement {
  return (
    <textarea
      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}

// Mock Select component with proper state management
interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Select({ children, value, onValueChange }: SelectProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  function handleValueChange(newValue: string): void {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          } as any);
        }

        if (child.type === SelectContent) {
          if (!isOpen) {
            return null;
          }
          return React.cloneElement(child, {
            onValueChange: handleValueChange,
            selectedValue,
          } as any);
        }

        return child;
      })}
    </div>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selectedValue?: string;
}

export function SelectTrigger({ children, onClick, selectedValue, ...props }: SelectTriggerProps): React.ReactElement {
  return (
    <button
      type="button"
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps): React.ReactElement {
  return <span>{placeholder || "Select..."}</span>;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  selectedValue?: string;
}

export function SelectContent({ children, onValueChange, selectedValue, ...props }: SelectContentProps): React.ReactElement {
  return (
    <div
      className="absolute top-full left-0 right-0 mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        return React.cloneElement(child, {
          onClick: () => onValueChange?.(child.props.value),
          isSelected: child.props.value === selectedValue,
        } as any);
      })}
    </div>
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value?: string;
  isSelected?: boolean;
}

export function SelectItem({ children, onClick, isSelected, ...props }: SelectItemProps): React.ReactElement {
  const className = `relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
    isSelected ? 'bg-accent' : ''
  }`;

  return (
    <div className={className} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({ children, variant = "default", className = "", ...props }: BadgeProps): React.ReactElement {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  };

  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variantClass = variantClasses[variant];
  const combinedClassName = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClassName} {...props}>
      {children}
    </span>
  );
}

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ children, open, onOpenChange }: DialogProps): React.ReactElement | null {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DialogContent({ children, ...props }: DialogContentProps): React.ReactElement {
  return <div {...props}>{children}</div>;
}

export function DialogHeader({ children, ...props }: DialogContentProps): React.ReactElement {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left" {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h2 className="text-lg font-semibold leading-none tracking-tight" {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return (
    <p className="text-sm text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, ...props }: DialogContentProps): React.ReactElement {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
      {children}
    </div>
  );
}

export function DialogTrigger({ children, ...props }: DialogContentProps): React.ReactElement {
  return <div {...props}>{children}</div>;
}

export { Plus as PlusIcon, X as XIcon } from "lucide-react";
