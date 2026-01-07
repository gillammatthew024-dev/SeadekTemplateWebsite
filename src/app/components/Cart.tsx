import { motion } from 'motion/react';
import { CartItem, Service } from './CartItem';
import { ShoppingBag } from 'lucide-react';

interface CartProps {
  services: Service[];
  onRemoveService: (id: string) => void;
  depositPercentage?: number;
}

export function Cart({ services, onRemoveService, depositPercentage = 30 }: CartProps) {
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);
  const depositAmount = (subtotal * depositPercentage) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-[400px] bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/30 shadow-2xl shadow-blue-500/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Your Booking</h2>
      </div>

      <div className="space-y-3 mb-6">
        {services.length === 0 ? (
          <div className="text-center py-8 text-blue-200/50">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No services selected</p>
          </div>
        ) : (
          services.map((service) => (
            <CartItem
              key={service.id}
              service={service}
              onRemove={onRemoveService}
            />
          ))
        )}
      </div>

      {services.length > 0 && (
        <>
          <div className="border-t border-blue-500/20 pt-4 space-y-3">
            <div className="flex justify-between text-blue-200/70">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl">
              <div>
                <p className="font-medium text-white">Deposit ({depositPercentage}%)</p>
                <p className="text-xs text-blue-200/60">Due today</p>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ${depositAmount.toFixed(2)}
              </p>
            </div>

            <div className="text-xs text-blue-200/60 text-center pt-2">
              Remaining ${(subtotal - depositAmount).toFixed(2)} due at appointment
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}