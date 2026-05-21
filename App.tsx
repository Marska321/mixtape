import { HeroSection } from "@/sections/HeroSection";

export const App = () => {
  return (
    <body className="text-black text-base not-italic normal-nums font-normal accent-auto bg-zinc-100 box-border caret-transparent block tracking-[normal] leading-6 list-outside list-disc outline-[3px] pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-inter">
      <div className="box-border caret-transparent outline-[3px]">
        <HeroSection />
      </div>
    </body>
  );
};
