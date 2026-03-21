import { ServiceStatus } from '@/lib/schemas/server';
import { cn } from '@/lib/utils';

interface StatusDotProps {
	status: ServiceStatus;
	className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
	const dotClass = {
		[ServiceStatus.Running]: 'bg-green shadow-[0_0_0_3px_#3fb95022]',
		[ServiceStatus.Starting]: 'bg-yellow animate-pulse',
		[ServiceStatus.Stopping]: 'bg-yellow animate-pulse',
		[ServiceStatus.Restarting]: 'bg-yellow animate-pulse',
		[ServiceStatus.Stopped]: 'bg-subtle',
		[ServiceStatus.Unknown]: 'bg-subtle',
	}[status] ?? 'bg-subtle';

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
