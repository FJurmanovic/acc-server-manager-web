import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, label, error, options, ...props }, ref) => {
		return (
			<div className="space-y-1">
				{label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
				<select
					className={cn(
						'block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
						error && 'border-red-500 focus:ring-red-500',
						className
					)}
					ref={ref}
					{...props}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{error && <p className="text-sm text-red-400">{error}</p>}
			</div>
		);
	}
);

Select.displayName = 'Select';
