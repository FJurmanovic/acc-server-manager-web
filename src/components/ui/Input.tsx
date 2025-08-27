import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, error, ...props }, ref) => {
		return (
			<div className="space-y-1">
				{label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
				<input
					className={cn(
						'block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
						error && 'border-red-500 focus:ring-red-500',
						className
					)}
					ref={ref}
					{...props}
				/>
				{error && <p className="text-sm text-red-400">{error}</p>}
			</div>
		);
	}
);

Input.displayName = 'Input';
