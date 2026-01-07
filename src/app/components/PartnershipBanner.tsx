import { ImageWithFallback } from './figma/ImageWithFallback';
import { myFont } from './MyFont';

export function PartnershipBanner() {
  return (
    <section className="relative h-80 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Partnership banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-blue-900"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4">
        <p className={`text-sm tracking-widest mb-3 text-gray-100 ${myFont.className}`}>COLLABORATION</p>
        <h2 className={'mb-4 tracking-wider mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent ${myFont.className}'}>IN PARTNERSHIP WITH CMD SEADEK CERTIFIED FABRICATOR</h2>
        <p className="max-w-2xl mx-auto text-gray-100">
          Bringing innovative marine solutions and exceptional design together to create 
          extraordinary experiences both on the road and on the water.
        </p>
      </div>
    </section>
  );
}
