import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger-outline' | 'danger-solid';
type ButtonSize = 'sm' | 'md';

interface GhButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-[#238636] border border-[#2ea043] text-white hover:bg-[#2ea043]',
	ghost: 'bg-transparent border border-gh-border text-gh-secondary hover:bg-gh-overlay hover:text-gh-primary',
	'danger-outline': 'bg-transparent border border-gh-border text-gh-red hover:border-gh-red/40 hover:bg-gh-red-bg',
	'danger-solid': 'bg-gh-overlay border border-gh-red/20 text-gh-red hover:bg-gh-red-bg',
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-xs',
	md: 'px-4 py-2 text-sm',
};

export function GhButton({
	variant = 'ghost',
	size = 'md',
	className,
	children,
	disabled,
	...props
}: GhButtonProps) {
	return (
		<button
			{...props}
			disabled={disabled}
			className={cn(
				'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gh-blue focus:ring-offset-1 focus:ring-offset-gh-base',
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
