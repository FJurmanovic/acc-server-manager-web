'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
	message: string;
	type: 'success' | 'error' | 'info';
	duration?: number;
	onClose?: () => void;
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			onClose?.();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!isVisible) return null;

	return (
		<div
			className={cn('fixed top-4 right-4 z-50 max-w-md rounded-md p-4 shadow-lg', {
				'bg-green-600 text-white': type === 'success',
				'bg-red-600 text-white': type === 'error',
				'bg-blue-600 text-white': type === 'info'
			})}
		>
			<div className="flex items-center justify-between">
				<p className="text-sm">{message}</p>
				<button
					onClick={() => {
						setIsVisible(false);
						onClose?.();
					}}
					className="ml-4 text-white hover:opacity-80"
				>
					×
				</button>
			</div>
		</div>
	);
}
