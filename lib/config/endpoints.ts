import { projectId, publicAnonKey } from '../../utils/supabase/info';

export function getEndpointConfig(source: string) {
  if (!projectId) {
    console.error('Supabase projectId is not configured');
    return null;
  }

  if (!publicAnonKey) {
    console.error('Supabase publicAnonKey is not configured');
    return null;
  }

  // Base headers used by all endpoints
  const baseHeaders = {
    'Authorization': `Bearer ${publicAnonKey}`, // ✅ Allows Supabase gateway to route request
    'X-Internal-Secret': process.env.SUPABASE_SERVICE_ROLE_KEY || '', // ✅ Your server-to-server auth
  };

  const configs: Record<string, { url: string; headers: Record<string, string> }> = {
    'seadek-portfolio': {
      url: `https://${projectId}.supabase.co/functions/v1/clever-responder`,
      headers: baseHeaders,
    },
    'main-portfolio': {
      url: `https://${projectId}.supabase.co/functions/v1/make-server-be0083bc`,
      headers: baseHeaders,
    },
    'service-list': {
      url: `https://${projectId}.supabase.co/functions/v1/hyper-function`,
      headers: baseHeaders,
    },
  };

  return configs[source] || null;
}