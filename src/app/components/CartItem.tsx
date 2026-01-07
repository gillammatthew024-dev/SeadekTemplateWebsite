import { motion } from 'motion/react';
import { X } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  specialist?: string;
}

interface CartItemProps {
  service: Service;
  onRemove: (id: string) => void;
}

export function CartItem({ service, onRemove }: CartItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="group relative flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-blue-500/20 hover:bg-slate-900/80 hover:border-blue-400/40 transition-all"
    >
      <div className="flex-1">
        <h3 className="font-medium text-white">{service.name}</h3>
        <p className="text-sm text-blue-200/70 mt-1">
          {service.duration}
          {service.specialist && ` • ${service.specialist}`}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <p className="font-semibold text-white">${service.price}</p>
        <button
          onClick={() => onRemove(service.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-lg"
          aria-label="Remove service"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </motion.div>
  );
}