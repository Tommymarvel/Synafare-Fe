import { cn } from "@/lib/utils";

const TopCards = ({
  children,
  title,
  value,
  iconbg,
}: {
  title: string;
  value: string;
  children: React.ReactNode;
  iconbg?: string;
}) => {
  return (
    <div className="rounded-[6px] flex-1 border border-gray-4 text-resin-black py-8 px-4 flex items-center justify-between">
      <div className="space-y-[6px]">
        <h3 className="text-[13px]">{title}</h3>
        <p className="text-lg font-medium">{value}</p>
      </div>
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center bg-gray-4 rounded-full ",
          iconbg
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default TopCards;
