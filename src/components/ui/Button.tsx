import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { forwardRef, ButtonHTMLAttributes } from "react";

// Button variants using cva (class-variance-authority)
const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-xl font-display font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--color-accent)] text-black border-2 border-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)]",
        outline:
          "bg-transparent text-[var(--color-accent)] border-2 border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black",
        ghost:
          "bg-transparent text-[var(--color-accent)] border-0 hover:underline",
        black:
          "bg-[var(--color-black)] text-white border-2 border-[var(--color-black)] hover:bg-[var(--color-accent)] hover:text-black",
        reset:
          "bg-[var(--color-reset)] text-black border-2 border-[var(--color-reset)] hover:bg-transparent hover:text-[var(--color-reset)]",
      },
      size: {
        base: "text-base px-7 py-3",
        sm: "text-sm px-4 py-2",
        lg: "text-lg px-8 py-4",
        icon: "p-3 text-xl w-12 h-12 justify-center",
      },
      full: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "base",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, full, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonStyles({ variant, size, full }), className)}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
