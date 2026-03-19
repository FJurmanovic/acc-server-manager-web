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
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="bg-opacity-50 absolute inset-0 bg-black" onClick={onClose} />
			<div
				className={cn(
					'relative mx-4 w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg',
					className
				)}
			>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-white">{title}</h3>
					<button onClick={onClose} className="text-gray-400 hover:text-white">
						×
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
