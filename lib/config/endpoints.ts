// This file should NEVER be imported on the client side
// It contains sensitive endpoint information
import { projectId, publicAnonKey } from '../../utils/supabase/info';
type EndpointConfig = {
  url: string;
  headers: Record<string, string>;
};

const anonKey = process.env.SUPABASE_ANON_KEY!;

export const ENDPOINT_REGISTRY: Record<string, EndpointConfig> = {
  'main-portfolio': {
    url: `https://${projectId}.supabase.co/functions/v1/make-server-be0083bc/projects`,
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  },
  'seadek-portfolio': {
    url: `https://${projectId}.supabase.co/functions/v1/clever-responder/projects`,
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  },
  // Add more endpoints here as needed
};

export function getEndpointConfig(source: string): EndpointConfig | null {
  return ENDPOINT_REGISTRY[source] || null;
}