'use client';

import { useState, useTransition } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { deleteServerAction } from '@/lib/actions/server-management';
import { Server } from '@/lib/types/server';

interface DeleteServerModalProps {
	isOpen: boolean;
	onClose: () => void;
	server: Server;
}

export function DeleteServerModal({ isOpen, onClose, server }: DeleteServerModalProps) {
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		setError(null);
		startTransition(async () => {
			try {
				const result = await deleteServerAction(server.id);
				if (result.success) {
					onClose();
				} else {
					setError(result.message);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to delete server');
			}
		});
	};

	const handleClose = () => {
		if (isPending) {
			return; // Prevent closing during deletion
		}
		onClose();
		setError(null);
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Delete Server">
			{error && <div className="mb-4 rounded-md bg-red-900 p-3 text-sm text-red-300">{error}</div>}

			<div className="mb-6">
				<p className="text-gray-300">
					Are you sure you want to delete the server <strong>"{server.name}"</strong>?
				</p>
				<p className="mt-2 text-sm text-gray-400">This action cannot be undone.</p>
			</div>

			<div className="flex justify-end space-x-2">
				<button
					onClick={handleClose}
					disabled={isPending}
					className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					onClick={handleDelete}
					disabled={isPending}
					className="flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-700 disabled:opacity-50"
				>
					{isPending ? (
						<>
							<LoadingSpinner size="sm" className="mr-2" />
							Deleting...
						</>
					) : (
						'Delete Server'
					)}
				</button>
			</div>
		</Modal>
	);
}
