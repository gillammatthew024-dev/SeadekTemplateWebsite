import { Header } from '../../components/Header';
import { supabase } from '../../../../utils/supabase/client'; 

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
    .from('service-table') // <-- generic type
    .select('*')
    .eq('title', title)
    .single();
  console.log(error);
  console.log(params.title);
  if (error || !data) {
    return <div>Service not found</div>;
  }

  return (

    <div className="p-10 min-h-screen bg-gray-100">
      <Header/>
      <div className = "mt-20">
      <h1 className="text-3xl mb-4">{data.title}</h1>
      <p>{data.details}</p>
      </div>
    </div>
  );
}
