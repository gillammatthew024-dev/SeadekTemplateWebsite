import { ImageWithFallback } from './figma/ImageWithFallback';
import { myFont } from './MyFont';
import Image from 'next/image';

export function PartnershipBanner() {
  return (
    <section className="relative h-80 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Partnership banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #0c4a7e 0%, #1a6fa0 50%, #1e7ab3 100%)',
      }}></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4">
        <p className={`text-sm tracking-widest mt-8 mb-3 text-gray-100 ${myFont.className}`}>COLLABORATION</p>
        <div className  = "w-screen flex flex-row justify-center items-center gap-8 mb-4 p-4">
          <img className = "rounded-lg shadow-sm" width = {250} height = {110} src="https://conceptmarinedesign.com/wp-content/uploads/2023/10/marine-logo-bleu-fr_uid62d576c52a616.svg" alt="CMD Produits Nautiques"></img>
          </div>
        <h2 className={'mt-8 mb-4 tracking-wider mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent ${myFont.className}'}>IN PARTNERSHIP WITH CMD SEADEK CERTIFIED FABRICATOR</h2>
        <p className="max-w-2xl mx-auto text-white font-heatlhy">
          Bringing innovative marine solutions and exceptional design together to create 
          extraordinary experiences both on the road and on the water.
        </p>
      </div>
    </section>
  );
}
