import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { supabase } from '../../../../utils/supabase/client'; 
import { myFont } from '../../components/MyFont';
import Hero3DBackground from '../../components/Hero3DBackground';
import BubbleWrapper from '../../components/BubbleWrapper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Type for a service row
interface Service {
  id: number;
  title: string;
  details?: string | null;
  created_at?: string | null;
}

interface PageProps {
  params: {
    title: string;
  };
}

export default async function Page({ params }: PageProps) {
  const title = decodeURIComponent(params.title);
  // Fetch single service by title
  const { data, error } = await supabase
    .from('service-table')
    .select('*')
    .eq('title', title)
    .single();
    
  console.log(error);
  console.log(params.title);
  
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-gray-400">The requested service could not be located.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Hero3DBackground
      modelPath = "../../models/mclaren/scene.gltf"
        modelType = "gltf"
      >
        <Header />
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            {/* Title Section with BubbleWrapper */}
            <div className="mb-8 sm:mb-12 lg:mb-16">
              <BubbleWrapper>
                <h1 className={`
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  font-bold tracking-tight
                  bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400
                  bg-clip-text text-transparent
                  animate-gradient-x
                  pb-2
                  ${myFont.className}
                `}>
                  {data.title}
                </h1>
              </BubbleWrapper>
            </div>

            {/* Details Section with BubbleWrapper */}
            <div className="space-y-6">
              <BubbleWrapper>
                <div className="prose prose-lg sm:prose-xl max-w-none">
                  <p className="
                    text-base sm:text-lg md:text-xl
                    text-gray-200
                    leading-relaxed sm:leading-loose
                    break-words
                    whitespace-pre-wrap
                    drop-shadow-lg
                    backdrop-blur-sm
                    bg-white/5 
                    rounded-xl 
                    p-6 sm:p-8 lg:p-10
                    border border-white/10
                    shadow-2xl
                  ">
                    {data.details}
                  </p>
                </div>
              </BubbleWrapper>
            </div>

            {/* Optional decorative elements */}
            <div className="mt-12 sm:mt-16 flex justify-center">
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full opacity-50"></div>
            </div>
          </div>
        </main>
      </Hero3DBackground>
      
      <Footer />
    </div>
  );
}