'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
			<div className="absolute inset-0" onClick={onClose} />
			<div
				className={cn(
					'relative w-full max-w-md rounded-lg border border-border bg-canvas p-6 shadow-xl',
					className
				)}
			>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-primary">{title}</h3>
					<button onClick={onClose} className="text-muted hover:text-primary">
						×
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
