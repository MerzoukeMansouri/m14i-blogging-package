import React from "react";

// Mock shadcn/ui components for Storybook
export const Button = ({ children, ...props }: any) => (
  <button className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90" {...props}>
    {children}
  </button>
);

export const Card = ({ children, ...props }: any) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm" {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, ...props }: any) => (
  <div className="flex flex-col space-y-1.5 p-6" {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, ...props }: any) => (
  <div className="p-6 pt-0" {...props}>
    {children}
  </div>
);

export const Label = ({ children, ...props }: any) => (
  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>
    {children}
  </label>
);

export const Input = (props: any) => (
  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />
);

export const Textarea = (props: any) => (
  <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />
);

// Mock Select component with proper state management
export const Select = ({ children, value, onValueChange }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          } as any);
        }

        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, {
            onValueChange: handleValueChange,
            selectedValue,
          } as any) : null;
        }

        return child;
      })}
    </div>
  );
};

export const SelectTrigger = ({ children, onClick, selectedValue, ...props }: any) => (
  <button
    type="button"
    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const SelectValue = ({ placeholder }: any) => <span>{placeholder || "Select..."}</span>;

export const SelectContent = ({ children, onValueChange, selectedValue, ...props }: any) => (
  <div className="absolute top-full left-0 right-0 mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md" {...props}>
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      return React.cloneElement(child, {
        onClick: () => onValueChange?.(child.props.value),
        isSelected: child.props.value === selectedValue,
      } as any);
    })}
  </div>
);

export const SelectItem = ({ children, onClick, isSelected, ...props }: any) => (
  <div
    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent' : ''}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

export { Plus as PlusIcon, X as XIcon } from "lucide-react";
