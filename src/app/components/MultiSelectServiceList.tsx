import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

/* ─── Types ───────────────────────────────────────── */

interface Service {
  title: string;
  id?: number | string;
}

interface ServicesResponse {
  services: Service[];
}

interface MultiSelectServiceListProps {
  onChange?: (titles: string[]) => void;
}

/* ─── Component ───────────────────────────────────── */

export function MultiSelectServiceList({
  onChange,
}: MultiSelectServiceListProps) {

  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchServices = async () => {
    const response_services = await fetch(

      `https://${projectId}.supabase.co/functions/v1/hyper-function/services`,
      {
        headers: {
          authorization: `Bearer ${publicAnonKey}`,
        }
      }
    );

    const data_services: ServicesResponse =
      (await response_services.json()) as ServicesResponse;

    return data_services.services;
  };

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const items = await fetchServices();
        setServices(items || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed fetching services");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const toggleSelect = (title: string) => {
    const updated = selected.includes(title)
      ? selected.filter((t) => t !== title)
      : [...selected, title];

    setSelected(updated);
    onChange?.(updated);
  };

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <p className="text-sm">Loading services...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <Card className="w-full p-2 bg-gradient-to-r from-black via-gray-900 to-blue-900 -z-10 opacity-60">
      <CardContent className="space-y-3">

        <Input
          placeholder="Search services"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className = "flex justify-center items-center">
        <div className="space-y-2 max-h-72 flex flex-col overflow-y-auto">
          {filtered.map((service) => (
            <label
              key={service.id ?? service.title}
              className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-100 text-gray-100"
            >
              <input
                type="checkbox"
                checked={selected.includes(service.title)}
                onChange={() => toggleSelect(service.title)}
              />

              <span className="text-sm font-medium">
                {service.title}
              </span>
            </label>
          ))}

          {filtered.length === 0 && (
            <p className="text-xs text-gray-500 p-2">
              No services found
            </p>
          )}
        </div>
        </div>

      </CardContent>
    </Card>
  );
}
