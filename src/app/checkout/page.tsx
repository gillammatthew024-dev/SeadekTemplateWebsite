'use client';
import { useState } from 'react';
import { WaterBackground } from '../components/WaterBackground';
import { Cart } from '../components/Cart';
import { CheckoutForm, FormData } from '../components/CheckoutForm';
import { Service } from '../components/CartItem';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

// Mock data for demonstration
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Deep Tissue Massage',
    duration: '60 minutes',
    price: 120,
    specialist: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    name: 'Facial Treatment',
    duration: '45 minutes',
    price: 95,
    specialist: 'Emily Rodriguez',
  },
];

export default function CheckOut() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    toast.success('Service removed from booking');
  };

  const handleCheckout = async (formData: FormData) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Processing payment with data:', formData);
    console.log('Services:', services);
    
    // In production, this would integrate with Stripe
    toast.success('Booking confirmed! Check your email for details.');
    setIsProcessing(false);
    
    // Reset after successful payment
    // setServices([]);
  };

  const subtotal = services.reduce((sum, service) => sum + service.price, 0);
  const depositAmount = (subtotal * 30) / 100;

  return (
    <>
      <Toaster position="top-center" richColors />
      <WaterBackground />
      
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Checkout
            </h1>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              Secure your appointment with a simple upfront deposit. 
              The remaining balance will be due at your appointment.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <CheckoutForm 
              onSubmit={handleCheckout} 
              isProcessing={isProcessing}
              totalAmount={depositAmount}
            />
            
            <Cart 
              services={services}
              onRemoveService={handleRemoveService}
              depositPercentage={30}
            />
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-40">
            <div className="text-sm text-blue-300/70">🔒 SSL Secured</div>
            <div className="text-sm text-blue-300/70">💳 Stripe Protected</div>
            <div className="text-sm text-blue-300/70">✓ PCI Compliant</div>
            <div className="text-sm text-blue-300/70">🛡️ Money-Back Guarantee</div>
          </div>
        </div>
      </div>
    </>
  );
}