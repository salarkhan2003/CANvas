
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: IconComponent, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8"> {/* Reduced bottom margin slightly */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {IconComponent && <IconComponent className="h-7 w-7 md:h-8 md:w-8 text-primary" />} {/* Use primary color for icon */}
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground tracking-tight">{title}</h1>
          </div>
          {description && <p className="mt-1.5 text-sm md:text-base text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row flex-wrap gap-2 items-start sm:items-center">{actions}</div>}
      </div>
    </div>
  );
}
