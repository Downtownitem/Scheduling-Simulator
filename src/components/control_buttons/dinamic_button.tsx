import { Switch } from "@heroui/react";

interface DynamicButtonProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function DynamicButton({
  value,
  onValueChange,
}: DynamicButtonProps) {
  return (
    <Switch
      classNames={{
        base: "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center justify-between cursor-pointer rounded-3xl gap-2 p-4 border-2 border-transparent bg-gray-50 data-[selected=true]:bg-primary-100 flex-grow",
        wrapper: "p-0 h-4 overflow-visible",
        thumb:
          "size-6 border-2 shadow-lg group-data-[hover=true]:border-default group-data-[selected=true]:border-primary group-data-[selected=true]:ms-6 group-data-[pressed=true]:w-7 group-data-[selected]:group-data-[pressed]:ms-4",
      }}
      isSelected={value}
      onValueChange={onValueChange}
    >
      <div className="flex items-center">
        <p className="text-sm">Simulación dinámica</p>
      </div>
    </Switch>
  );
}
