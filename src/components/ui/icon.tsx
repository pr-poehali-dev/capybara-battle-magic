
import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?: string;
  size?: number;
  className?: string;
  fallback?: string;
}

const Icon = ({ 
  name, 
  color, 
  size = 24, 
  fallback = 'HelpCircle',
  className,
  ...props 
}: IconProps) => {
  // @ts-ignore - dynamic imports
  const LucideIcon = Icons[name as keyof typeof Icons] || Icons[fallback as keyof typeof Icons];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found. Using fallback.`);
    return <Icons.HelpCircle size={size} color={color} className={className} {...props} />;
  }
  
  return (
    <LucideIcon 
      size={size} 
      color={color} 
      className={cn(className)} 
      {...props} 
    />
  );
};

export default Icon;
