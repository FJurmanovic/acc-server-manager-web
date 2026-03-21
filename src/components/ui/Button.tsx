import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger-outline' | 'danger-solid';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-btn-green border border-btn-green-hover text-white hover:bg-btn-green-hover',
	ghost: 'bg-transparent border border-border text-secondary hover:bg-overlay hover:text-primary',
	'danger-outline': 'bg-transparent border border-border text-red hover:border-red/40 hover:bg-red-bg',
	'danger-solid': 'bg-overlay border border-red/20 text-red hover:bg-red-bg',
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-xs',
	md: 'px-4 py-2 text-sm',
};

export function Button({
	variant = 'ghost',
	size = 'md',
	className,
	children,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			{...props}
			disabled={disabled}
			className={cn(
				'inline-flex items-center gap-1.5 justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-1 focus:ring-offset-base',
				'disabled:cursor-not-allowed disabled:opacity-40',
				variantClasses[variant],
				sizeClasses[size],
				className
			)}
		>
			{children}
		</button>
	);
}
