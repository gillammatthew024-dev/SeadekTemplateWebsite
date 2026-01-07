import { useState } from "react";
import { MultiSelectServiceList } from "./MultiSelectServiceList";

interface Props {
  onChange?: (titles: string[]) => void;
}
export default function ServiceCarousel({ onChange }: Props) {
  const [services, setServices] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {/* Fetch + select list */}
      <MultiSelectServiceList
        onChange={(titles) => onChange(titles)}
      />

      {/* ─── CAROUSEL STYLE VIEW ─── */}
      {services.length > 0 && (
        <div className="relative overflow-x-auto whitespace-nowrap py-2">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-blue-900 -z-10 opacity-30"></div>
          <div className="inline-flex gap-3">
            {services.map((title) => (
              <div
                key={title}
                className="
                  min-w-[200px]
                  bg-white
                  border
                  rounded-xl
                  shadow-sm
                  p-3
                  text-sm font-medium
                  transition-transform
                  hover:-translate-y-1
                "
              >
                {title}
              </div>
            ))}
          </div>
        </div>
    )}
    </div>
  );
}
