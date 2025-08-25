import tw from "@/utils/tw";
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex self-start shrink-0 justify-center items-center rounded-lg font-bold overflow-hidden shadow-[0px_1px_2px_0px_rgba(105,81,255,0.05)] transition-colors duration-150 font-medium select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "w-auto h-8 flex-none px-2 text-sm",
        md: "w-48 h-10 px-4 text-base",
        lg: "w-96 h-11 px-4 text-base"
      },
      borderType: {
        solid: "",
        outline: "border border-2",
      },
      color: {
        primary: "",
        secondary: ""
      }
    },
    compoundVariants: [
      // primary + solid
      {
        borderType: "solid",
        color: "primary",
        class: "bg-primary-500 text-white enabled:hover:bg-primary-300 disabled:bg-primary-200/50 disabled:text-slate-400/70"
      },
      // primary + outline
      {
        borderType: "outline",
        color: "primary",
        class: "border-primary-500 text-primary-500 enabled:hover:bg-primary-300/20 disabled:border-primary-200 disabled:text-slate-400/70"
      },
      // secondary + solid
      {
        borderType: "solid",
        color: "secondary",
        class: "bg-secondary-500 text-secondary-700 enabled:hover:bg-secondary-300 disabled:bg-secondary-200/50 disabled:text-slate-400/70"
      },
      // secondary + outline
      {
        borderType: "outline",
        color: "secondary",
        class: "border-secondary-500 text-secondary-500 enabled:hover:bg-secondary-300/20 disabled:border-secondary-300 disabled:text-slate-400/70"
      },
    ]
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
  hasIcon?: boolean;
  fullWidth?: boolean;
}

function Button( { 
  children, 
  type = "button" as const, 
  size,
  borderType, 
  color, 
  className,
  hasIcon = false,
  fullWidth = false,
  ...rest
 }:ButtonProps ) {
  return (
    <button
      type={type}
      className={tw(
        buttonVariants({ size, borderType, color }),
        hasIcon && "gap-2",
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >{children}</button>
  )
}
export default Button