export const BackgroundEffects = () => {
  return (
    <div className="absolute box-border caret-transparent outline-[3px] pointer-events-none z-[5] overflow-hidden inset-0">
      <div className="absolute bg-slate-900 box-border caret-transparent mix-blend-multiply opacity-10 outline-[3px] inset-0"></div>
      <div className="absolute bg-fuchsia-600 box-border caret-transparent blur-[120px] h-[600px] mix-blend-screen opacity-20 outline-[3px] w-[600px] rounded-full left-1/4 top-[33.3333%]"></div>
      <div className="absolute bg-cyan-500 box-border caret-transparent blur-[100px] h-[500px] mix-blend-color-dodge opacity-15 outline-[3px] w-[500px] rounded-full right-1/4 bottom-[33.3333%]"></div>
      <div className="absolute bg-[linear-gradient(to_right_top,rgba(88,28,135,0.2),rgba(30,58,138,0.2))] box-border caret-transparent mix-blend-color-dodge outline-[3px] inset-0"></div>
    </div>
  );
};
