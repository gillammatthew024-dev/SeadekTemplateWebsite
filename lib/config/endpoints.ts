import { projectId, publicAnonKey } from '../../utils/supabase/info';

export function getEndpointConfig(source: string) {
  if (!projectId) {
    console.error('Supabase projectId is not configured');
    return null;
  }

  const configs: Record<string, { url: string; headers: Record<string, string> }> = {
    'seadek-portfolio': {
      url: `https://${projectId}.supabase.co/functions/v1/clever-responder`,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    },
    'main-portfolio': {
      url: `https://${projectId}.supabase.co/functions/v1/make-server-be0083bc`,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    },
    'service-list': {
      url: `https://${projectId}.supabase.co/functions/v1/hyper-function`,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    },
  };

  return configs[source] || null;
}