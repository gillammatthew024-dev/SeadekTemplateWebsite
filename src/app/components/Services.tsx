'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { myFont } from './MyFont';
import { ServiceIcon } from './ServiceIcon';
import GlossyCard from './GlossyCardComponent';
import './ResponsiveTitle.css';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
}

interface ServicesProps {
  services: Service[];
}

// Separated ServicesList component for better organization
export function ServicesList({ services }: ServicesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GlossyCard
            title={service.title}
            icon={<ServiceIcon name={service.icon} size={32} />}
            accentColor="#f59e0b"
          >
            <p className="text-gray-300 leading-relaxed break-words">
              {service.description}
            </p>
          </GlossyCard>
        </motion.div>
      ))}
    </div>
  );
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
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
      
      const servicesWithIds: Service[] = received.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.details,
        icon: p.icon,
        createdAt: p.createdAt,
      }));

      // Sort newest first
      servicesWithIds.sort((a, b) => 
        (b.createdAt || '').localeCompare(a.createdAt || '')
      );

      setServices(servicesWithIds);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="services" 
      className="relative overflow-hidden"
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-medium text-amber-500">Our Expertise</span>
          </div>
          
          <h2 className={`brand-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${myFont.className}`}>
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent break-words">
              Services
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed px-4 break-words">
            Comprehensive solutions tailored to meet your unique needs and exceed your expectations
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-500/20 rounded-full animate-spin border-t-amber-500" />
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500 absolute inset-0 animate-reverse-spin" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4 px-4 break-words">{error}</p>
            <button 
              onClick={fetchServices}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative h-full p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ServiceIcon name={service.icon} size={24} className="text-amber-400 sm:w-7 sm:h-7" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-amber-400 transition-colors break-words hyphens-auto">
                      {service.title}
                    </h3>
                    
                    {/* Learn More Link */}
                    <a 
                      href={`/services/${encodeURIComponent(service.title)}`} 
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200 break-words"
                    >
                      <span>Learn More</span>
                      <ArrowRight 
                        size={14} 
                        className="group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0 sm:w-4 sm:h-4" 
                      />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {!loading && !error && services.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12 sm:mt-16"
          >
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Get Started Today
              <ArrowRight size={16} className="sm:w-5 sm:h-5" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}