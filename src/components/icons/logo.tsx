
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 24" // Adjusted viewBox for text-like logo
      fill="currentColor"
      {...props}
      className={`h-6 w-auto ${props.className || ''}`} // Ensure responsiveness
    >
      <text 
        x="0" 
        y="19" // Adjusted y for vertical centering
        fontFamily="Space Grotesk, sans-serif" // Using the app's headline font
        fontSize="20" 
        fontWeight="bold"
        letterSpacing="0.5"
      >
        CANvas
      </text>
    </svg>
  );
}
