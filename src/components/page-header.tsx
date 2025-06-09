import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon; // Changed to lowercase 'icon' to match usage
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: IconComponent, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            {IconComponent && <IconComponent className="h-7 w-7 text-accent" />}
            <h1 className="text-3xl font-headline font-semibold text-foreground tracking-tight">{title}</h1>
          </div>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 items-start sm:items-center">{actions}</div>}
      </div>
    </div>
  );
}