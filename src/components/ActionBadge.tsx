 export type ActionBadgeProps = {
  containerVariant: string;
  labelVariant: string;
  text: string;
};

export const ActionBadge = (props: ActionBadgeProps) => {
  return (
    <div
      className={`absolute box-border caret-transparent outline-[3px] bottom-[25px] ${props.containerVariant}`}
    >
      <div
        className={`text-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.1)_0px_2px_4px_-2px] box-border caret-transparent outline-[3px] border py-1 border-solid border-white/50 font-rock_salt ${props.labelVariant}`}
      >
        {props.text}
      </div>
    </div>
  );
};
