import { useTheme } from "@/context/ThemeContext";

export const ToggleIcon = () => {
  const { theme, toggleTheme } = useTheme();
  const isNight = theme === "night";

  return (
    <div
      onClick={toggleTheme}
      className="relative cursor-pointer select-none"
      style={{
        width: 56,
        height: 96,
        borderRadius: 10,
        border: "2px solid rgb(75,85,99)",
        background: "rgb(107,114,128)",
        boxShadow: "rgba(0,10,20,0.7) 0px 0px 15px 0px inset, rgba(0,0,0,0.6) 0px 4px 12px 0px",
      }}
      title={isNight ? "Switch to Day" : "Switch to Night"}
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none mix-blend-overlay"
        style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(6,182,212,0.15))" }}
      />

      {/* Sliding lever */}
      <div
        className="absolute left-1/2 w-10 rounded transition-all duration-300 ease-in-out"
        style={{
          transform: "translateX(-50%)",
          top: isNight ? 24 : 8,
          height: 64,
          background: "linear-gradient(rgb(122,133,149), rgb(106,117,133))",
          boxShadow: "rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <div className="bg-black/10 h-px w-full mt-8" />
        <div className="bg-black/10 h-px w-full mt-1" />
        <div className="bg-black/10 h-px w-full mt-1" />
      </div>

      {/* LED indicator — cyan when night (lights on), amber when day */}
      <div
        className="absolute left-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300"
        style={{
          transform: "translateX(-50%)",
          top: 8,
          background: isNight ? "rgb(34,211,238)" : "rgb(251,191,36)",
          boxShadow: isNight
            ? "rgba(34,211,238,0.8) 0px 0px 8px 2px"
            : "rgba(251,191,36,0.8) 0px 0px 8px 2px",
        }}
      />
    </div>
  );
};
