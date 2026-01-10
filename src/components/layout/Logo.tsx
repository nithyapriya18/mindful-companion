import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
}

export function Logo({ size = 'md', linkTo = '/' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className={`font-bold ${sizeClasses[size]} flex items-center gap-1`}>
      <span className="text-primary">MyT</span>
      <span className="text-foreground">+</span>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
