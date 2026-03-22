import { cn } from '@/lib/utils';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

interface BadgeProps {
	variant: BadgeVariant;
	children: React.ReactNode;
	className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
	green: 'bg-green-bg text-green border border-green/20',
	yellow: 'bg-yellow-bg text-yellow border border-yellow/20',
	red: 'bg-red-bg text-red border border-red/20',
	blue: 'bg-blue-bg text-blue border border-blue/20',
	gray: 'bg-overlay text-muted border border-border',
};

export function Badge({ variant, children, className }: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
				variantClasses[variant],
				className
			)}
		>
			{children}
		</span>
	);
}
