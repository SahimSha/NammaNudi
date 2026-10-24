import React from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Compass,
  Bus,
  ShoppingBag,
  Utensils,
  HeartPulse,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Home,
  HelpCircle
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  iconName: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, ...props }) => {
  switch (iconName) {
    case 'Compass':
      return <Compass {...props} />;
    case 'Bus':
      return <Bus {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Utensils':
      return <Utensils {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Home':
      return <Home {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
