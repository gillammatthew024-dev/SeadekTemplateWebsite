import { motion } from 'motion/react';
import { CreditCard, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';

interface CheckoutFormProps {
  onSubmit: (data: FormData) => void;
  isProcessing?: boolean;
  totalAmount: number;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export function CheckoutForm({ onSubmit, isProcessing = false, totalAmount }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-blue-500/30 shadow-2xl shadow-blue-500/10"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Complete Your Booking
        </h1>
        <p className="text-blue-200/70">Secure your appointment with a deposit</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Information
          </h3>
          
          <div>
            <label htmlFor="name" className="block text-sm text-blue-200/70 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder:text-slate-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm text-blue-200/70 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder:text-slate-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm text-blue-200/70 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder:text-slate-500"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </h3>

          <div>
            <label htmlFor="cardNumber" className="block text-sm text-blue-200/70 mb-2">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={handleChange('cardNumber')}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder:text-slate-500"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm text-blue-200/70 mb-2">
                Expiry Date
              </label>
              <input
                id="expiry"
                type="text"
                value={formData.expiry}
                onChange={handleChange('expiry')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder:text-slate-500"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>

            <div>
              <label htmlFor="cvc" className="block text-sm text-blue-200/70 mb-2">
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                value={formData.cvc}
                onChange={handleChange('cvc')}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder:text-slate-500"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isProcessing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Pay ${totalAmount.toFixed(2)} Deposit
            </>
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-2 text-xs text-blue-200/50">
          <Lock className="w-3 h-3" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </form>
    </motion.div>
  );
}