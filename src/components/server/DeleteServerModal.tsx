'use client';

import { useState, useTransition } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { deleteServerAction } from '@/lib/actions/server-management';
import { Server } from '@/lib/schemas/server';

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
			return;
		}
		onClose();
		setError(null);
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Delete Server">
			{error && <div className="mb-4 rounded-md border border-red/20 bg-red-bg p-3 text-sm text-red">{error}</div>}

			<div className="mb-6">
				<p className="text-secondary">
					Are you sure you want to delete the server <strong>&quot;{server.name}&quot;</strong>?
				</p>
				<p className="mt-2 text-sm text-muted">This action cannot be undone.</p>
			</div>

			<div className="flex justify-end space-x-2">
				<Button
					variant="ghost"
					size="md"
					onClick={handleClose}
					disabled={isPending}
				>
					Cancel
				</Button>
				<Button
					variant="danger-solid"
					size="md"
					onClick={handleDelete}
					disabled={isPending}
				>
					{isPending ? (
						<>
							<LoadingSpinner size="sm" />
							Deleting...
						</>
					) : (
						'Delete Server'
					)}
				</Button>
			</div>
		</Modal>
	);
}
