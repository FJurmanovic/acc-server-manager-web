import { ServiceStatus } from '@/lib/schemas/server';
import { cn } from '@/lib/utils';

interface StatusDotProps {
	status: ServiceStatus;
	className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
	const dotClass = {
		[ServiceStatus.Running]: 'bg-gh-green shadow-[0_0_0_3px_#3fb95022]',
		[ServiceStatus.Starting]: 'bg-gh-yellow animate-pulse',
		[ServiceStatus.Stopping]: 'bg-gh-yellow animate-pulse',
		[ServiceStatus.Restarting]: 'bg-gh-yellow animate-pulse',
		[ServiceStatus.Stopped]: 'bg-gh-subtle',
		[ServiceStatus.Unknown]: 'bg-gh-subtle',
	}[status] ?? 'bg-gh-subtle';

	return (
		<span
			className={cn(
				'inline-block h-2 w-2 rounded-full flex-shrink-0',
				dotClass,
				className
			)}
		/>
	);
}
