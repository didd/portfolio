import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-block cursor-default transition-all duration-150",
  {
    variants: {
      variant: {
        outline:
          "text-[0.75rem] text-p-text2 border border-p-border2 px-3 py-1 hover:border-p-accent hover:text-p-accent",
        default:
          "font-mono text-[0.6rem] text-p-text3 bg-p-bg3 px-2 py-0.5 tracking-[0.04em] border border-p-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TagProps = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof tagVariants>;

export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)}>{children}</span>
  );
}
