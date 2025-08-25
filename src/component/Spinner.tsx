import tw from "@/utils/tw";

interface SpinnerProps {
  size?: string;  // "50px" | "2rem" 등
  className?: string;
}

function Spinner( { 
  size = "50px",
  className
}:SpinnerProps ) {
  return (
    <div className={tw("size-full flex justify-center items-center", className)}>
      <div className={"animation-spinner"}
      style={
        {
          width: size,
          height: size,
        }
      }
      >
      </div>
    </div>
  )
}
export default Spinner


