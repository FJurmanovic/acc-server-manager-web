import { cn } from '@/lib/utils';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

interface BadgeProps {
	variant: BadgeVariant;
	children: React.ReactNode;
	className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
	green: 'bg-gh-green-bg text-gh-green border border-gh-green/20',
	yellow: 'bg-gh-yellow-bg text-gh-yellow border border-gh-yellow/20',
	red: 'bg-gh-red-bg text-gh-red border border-gh-red/20',
	blue: 'bg-gh-blue-bg text-gh-blue border border-gh-blue/20',
	gray: 'bg-gh-overlay text-gh-muted border border-gh-border',
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
