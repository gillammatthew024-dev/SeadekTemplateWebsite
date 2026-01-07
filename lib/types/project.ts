export interface Project {
  id: string;
  title: string;
  description?: string;
  details?: string;
  imageUrls?: string[];
  createdAt?: string;
  services?: string[];
}
export interface PortfolioConfig {
    source : string;
    sectionid: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
    showServiceFilter: boolean;
    maxPreviewItems: number; 
}