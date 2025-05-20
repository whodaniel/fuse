import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils.js';

/**
 * Button variants using class-variance-authority
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Button component props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether to render the button as a child component
   */
  asChild?: boolean;
  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;
  /**
   * Icon to display in the button
   */
  icon?: React.ReactNode;
  /**
   * Position of the icon
   */
  iconPosition?: 'start' | 'end';
}

/**
 * Button component with support for variants, sizes, loading state, and icons
 *
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variants
 * <Button variant="destructive">Delete</Button>
 * <Button variant="outline">Cancel</Button>
 *
 * // With sizes
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 *
 * // With loading state
 * <Button isLoading>Processing...</Button>
 *
 * // With icon
 * <Button icon={<IconComponent />}>With Icon</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    icon,
    iconPosition = 'start',
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    const content = (
      <>
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-3 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && iconPosition === 'start' && (
          <span className={cn("mr-2", { "ml-2": isLoading })}>
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'end' && (
          <span className="ml-2">
            {icon}
          </span>
        )}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
