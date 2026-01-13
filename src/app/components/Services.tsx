'use client';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import ServiceCarousel from './ServiceCarousel';
import { myFont } from './MyFont';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
}
// In your Services component
import { ServiceIcon } from './ServiceIcon';
import GlossyCard from './GlossyCardComponent';

interface ServicesProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <GlossyCard
          key={service.id}
          title={service.title}
          icon={<ServiceIcon name={service.icon} size={28} />}
          accentColor="#b16707" // Your brand gold color
        >
          <p>{service.description}</p>
        </GlossyCard>
      ))}
    </div>
  );
}
export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    fetchServices();
  }, []);
  const fetchServices = async () => {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/hyper-function/services`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
  
        const contentType = res.headers.get('content-type') || '';
        const raw = await res.text();
  
        if (!res.ok) {
          let msg = raw;
          if (contentType.includes('application/json')) {
            try {
              const parsed = JSON.parse(raw);
              msg = parsed.error || parsed.message || JSON.stringify(parsed);
            } catch {}
          }
          throw new Error(`Server error (${res.status}): ${msg}`);
        }
  
        if (!contentType.includes('application/json')) {
          throw new Error('Expected JSON response but received: ' + raw.slice(0, 1000));
        }
  
        const data = JSON.parse(raw);
        const received: any[] = data.services || [];
        console.log(received);
        const servicesWithIds: Service[] = received.map((p, i) => ({
          id: p.id,
          title: p.title,
          description: p.details,
          icon: p.icon,
          createdAt: p.createdAt,
        }));
  
        // sort newest first
        servicesWithIds.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  
        setServices(servicesWithIds);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
	return (
		<section id="services" className="py-20 w-full h-full relative overflow-hidden">
			<div className="absolute inset-0 bg-black -z-10 opacity-10"></div>

			<div className="mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className={`mb-4 tracking-wider mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600
      bg-clip-text text-transparent ${myFont.className}`}>SERVICES</h2>
					<p className="max-w-2xl mx-auto text-gray-100">
						Comprehensive solutions tailored to meet your unique needs and exceed
						your expectations
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{services.map((service, index) => {
						return (
							<GlossyCard
          key={service.id}
          title={service.title}
          icon={<ServiceIcon name={service.icon} size={28} />}
          accentColor="#b16707" // Your brand gold color
        >
          <a href={`/services/${encodeURIComponent(service.title)}`} className="text-gray-200 hover:underline flex items-center justify-between">
            <span>Learn More</span>
            <ArrowRight size={16} className="ml-2" />
          </a>
        </GlossyCard>
						);
					})}
				</div>
			</div>
		</section>
	);
}
