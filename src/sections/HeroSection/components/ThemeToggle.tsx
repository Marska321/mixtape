import { ToggleIcon } from "@/sections/HeroSection/components/ToggleIcon";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = () => {
  const { theme } = useTheme();
  return (
    <div className="fixed items-center box-border caret-transparent gap-x-2 flex flex-col outline-[3px] gap-y-2 translate-y-[-50.0%] z-[100] right-8 top-2/4">
      <ToggleIcon />
      <div className="items-center box-border caret-transparent flex flex-col min-h-[auto] min-w-[auto] outline-[3px]">
        <span className="text-white/80 text-[9px] font-bold box-border caret-transparent block tracking-[1.8px] leading-[13.5px] min-h-[auto] min-w-[auto] outline-[3px] font-ui_sans_serif transition-all duration-300">
          {theme === "night" ? "NIGHT" : "DAY"}
        </span>
      </div>
    </div>
  );
};
