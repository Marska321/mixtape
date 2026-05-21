export const SearchForm = () => {
  return (
    <form className="box-border caret-transparent outline-[3px]">
      <input
        placeholder="Type your vibe..."
        type="text"
        value=""
        className="text-slate-800 text-2xl bg-transparent box-border caret-transparent h-full leading-8 outline-[3px] rotate-[-0.9999993263990709deg] w-full p-0 font-permanent_marker"
      />
      <button
        type="submit"
        className="bg-transparent caret-transparent hidden outline-[3px] text-center p-0"
      ></button>
    </form>
  );
};
