export interface SeadekProject {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  details: string;
  client?: string;
  year?: string;
  gallery: string[];
}

export const allSeadekProjects: SeadekProject[] = [
  {
    id: 1,
    title: 'Luxury Yacht Interior',
    category: 'Marine Design',
    image: 'https://images.unsplash.com/photo-1598448056086-307e98ef5c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGludGVyaW9yJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzQ3NDI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'A complete SeaDek flooring transformation for a luxury yacht, featuring custom patterns and premium materials.',
    details: 'This comprehensive marine flooring project included custom-designed EVA foam decking throughout the entire vessel, providing superior traction, comfort, and visual appeal while maintaining the yacht\'s elegant aesthetic.',
    client: 'Private Yacht Owner',
    year: '2025',
    gallery: [
      'https://images.unsplash.com/photo-1598448056086-307e98ef5c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGludGVyaW9yJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzQ3NDI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758294895473-3570bfccbf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib2F0JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1627761801957-4bf6cfb4fa20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMG9jZWFufGVufDF8fHx8MTc2NzMzMjE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 2,
    title: 'Custom Deck Design',
    category: 'Deck Solutions',
    image: 'https://images.unsplash.com/photo-1721886271546-b97a376f66a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2F0JTIwZGVjayUyMGRlc2lnbnxlbnwxfHx8fDE3Njc1MDg2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Precision-engineered boat deck flooring with custom color combinations and intricate design patterns.',
    details: 'Working closely with the boat owner, we created a unique deck design that combines functionality with striking visual appeal, using SeaDek\'s advanced EVA foam technology for maximum durability and comfort.',
    client: 'Marine Enthusiast',
    year: '2024',
    gallery: [
      'https://images.unsplash.com/photo-1721886271546-b97a376f66a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2F0JTIwZGVjayUyMGRlc2lnbnxlbnwxfHx8fDE3Njc1MDg2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1569841194745-1a51d7a9b05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFkZWslMjBib2F0JTIwZGVja2luZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 3,
    title: 'Marine Vessel Upgrade',
    category: 'Retrofit',
    image: 'https://images.unsplash.com/photo-1704124655410-0642a47ef810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjB2ZXNzZWwlMjBkZXRhaWx8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Complete marine vessel flooring upgrade featuring SeaDek\'s latest non-slip technology and contemporary styling.',
    details: 'This retrofit project transformed an aging vessel into a modern maritime masterpiece, utilizing cutting-edge materials and installation techniques to ensure long-lasting performance in challenging marine environments.',
    client: 'Commercial Fleet',
    year: '2025',
    gallery: [
      'https://images.unsplash.com/photo-1704124655410-0642a47ef810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjB2ZXNzZWwlMjBkZXRhaWx8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1612654842762-5e26b7c16407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGRlY2slMjBmbG9vcmluZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1569841194745-1a51d7a9b05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFkZWslMjBib2F0JTIwZGVja2luZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 4,
    title: 'Premium Boat Interior',
    category: 'Interior Design',
    image: 'https://images.unsplash.com/photo-1758294895473-3570bfccbf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib2F0JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Sophisticated interior flooring solution combining luxury materials with practical marine-grade performance.',
    details: 'A comprehensive interior flooring installation that brings together SeaDek\'s premium product line with custom design elements, creating a sophisticated space that enhances both comfort and safety aboard.',
    client: 'Luxury Boat Builder',
    year: '2024',
    gallery: [
      'https://images.unsplash.com/photo-1758294895473-3570bfccbf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib2F0JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1598448056086-307e98ef5c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGludGVyaW9yJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzQ3NDI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1721886271546-b97a376f66a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2F0JTIwZGVjayUyMGRlc2lnbnxlbnwxfHx8fDE3Njc1MDg2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 5,
    title: 'Sport Fishing Vessel',
    category: 'Performance',
    image: 'https://images.unsplash.com/photo-1569841194745-1a51d7a9b05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFkZWslMjBib2F0JTIwZGVja2luZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'High-performance deck flooring engineered for demanding sport fishing conditions with superior grip and durability.',
    details: 'This project focused on creating a deck surface that can withstand the rigors of sport fishing while providing maximum safety and comfort for anglers in all weather conditions.',
    client: 'Sport Fishing Charter',
    year: '2025',
    gallery: [
      'https://images.unsplash.com/photo-1569841194745-1a51d7a9b05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFkZWslMjBib2F0JTIwZGVja2luZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1704124655410-0642a47ef810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjB2ZXNzZWwlMjBkZXRhaWx8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 6,
    title: 'Yacht Deck Restoration',
    category: 'Restoration',
    image: 'https://images.unsplash.com/photo-1612654842762-5e26b7c16407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGRlY2slMjBmbG9vcmluZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Complete deck restoration using SeaDek premium materials to revitalize a classic yacht\'s exterior spaces.',
    details: 'This restoration project breathed new life into a vintage yacht by replacing worn surfaces with modern SeaDek flooring, preserving the vessel\'s classic character while adding contemporary functionality.',
    client: 'Classic Yacht Restoration',
    year: '2024',
    gallery: [
      'https://images.unsplash.com/photo-1612654842762-5e26b7c16407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGRlY2slMjBmbG9vcmluZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1627761801957-4bf6cfb4fa20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMG9jZWFufGVufDF8fHx8MTc2NzMzMjE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758294895473-3570bfccbf48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib2F0JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 7,
    title: 'Commercial Marine Fleet',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Fleet-wide SeaDek installation project providing consistent quality and performance across multiple vessels.',
    details: 'A large-scale commercial project that standardized deck flooring across an entire fleet, ensuring uniform safety standards, reduced maintenance costs, and enhanced operational efficiency.',
    client: 'Maritime Transport Co.',
    year: '2025',
    gallery: [
      'https://images.unsplash.com/photo-1605472074915-e1406eda66bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjBib2F0JTIwZGVja3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1704124655410-0642a47ef810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbmUlMjB2ZXNzZWwlMjBkZXRhaWx8ZW58MXx8fHwxNzY3NTA4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1721886271546-b97a376f66a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2F0JTIwZGVjayUyMGRlc2lnbnxlbnwxfHx8fDE3Njc1MDg2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  },
  {
    id: 8,
    title: 'Swim Platform Enhancement',
    category: 'Custom Solutions',
    image: 'https://images.unsplash.com/photo-1627761801957-4bf6cfb4fa20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMG9jZWFufGVufDF8fHx8MTc2NzMzMjE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Custom swim platform installation featuring precision-cut SeaDek for enhanced safety and aesthetic appeal.',
    details: 'This specialized project created a custom swim platform solution that combines safety features with elegant design, perfect for easy water access while maintaining the vessel\'s luxury appearance.',
    client: 'Yacht Club Member',
    year: '2024',
    gallery: [
      'https://images.unsplash.com/photo-1627761801957-4bf6cfb4fa20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMG9jZWFufGVufDF8fHx8MTc2NzMzMjE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1598448056086-307e98ef5c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGludGVyaW9yJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzQ3NDI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1612654842762-5e26b7c16407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWNodCUyMGRlY2slMjBmbG9vcmluZ3xlbnwxfHx8fDE3Njc1MDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ]
  }
];

// Selected projects for the Seadek portfolio section (first 4)
export const selectedSeadekProjects = allSeadekProjects.slice(0, 4);
