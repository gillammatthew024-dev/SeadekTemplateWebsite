import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutSeadek() {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r bg-gradient-to-r from-black via-gray-900 to-blue-900 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6 tracking-wider mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600
      bg-clip-text text-transparent">ABOUT US</h2>
            <p className="mb-4 text-gray-100">
              We are a team of passionate designers and creators dedicated to bringing
              your vision to life. With years of experience in the industry, we specialize
              in creating elegant, functional, and memorable experiences.
            </p>
            <p className="mb-4 text-gray-100">
              Our approach combines strategic thinking with creative excellence, ensuring
              that every project we undertake exceeds expectations and delivers measurable
              results.
            </p>
            <p className="text-gray-100">
              From concept to completion, we work closely with our clients to understand
              their unique needs and transform their ideas into reality.
            </p>
          </div>
          
          <div className="relative h-96 lg:h-[500px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1572457598110-2e060c4588ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjczNDA5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="About us"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
