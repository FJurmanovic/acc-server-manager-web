'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { createServerAction, type ServerActionResult } from '@/lib/actions/server-management';
import { useServerCreationPopup } from '@/lib/context/ServerCreationPopupContext';

interface CreateServerModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const initialState: ServerActionResult = { success: false, message: '', data: undefined };

export function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
	const [serverName, setServerName] = useState('');
	const [submittedName, setSubmittedName] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPending, setTransition] = useTransition();

	const [state, formAction] = useActionState(createServerAction, initialState);
	const { showPopup } = useServerCreationPopup();

	useEffect(() => {
		if (state.success && state.data?.id) {
			showPopup(state.data.id, submittedName);
			onClose();
			setIsSubmitting(false);
		}
	}, [state.success, state.data, showPopup, onClose, submittedName]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
		setTransition(async () => {
			e.preventDefault();

			if (!serverName.trim()) {
				return;
			}

			setIsSubmitting(true);
			const formData = new FormData();
			formData.append('name', serverName.trim());
			formAction(formData);
			setSubmittedName(serverName.trim());
			setServerName('');
		});

	const handleClose = () => {
		if (isSubmitting) {
			return;
		}
		onClose();
		setServerName('');
		setIsSubmitting(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Create New Server">
			{!state.success && state.message && (
				<div className="mb-4 rounded-md border border-red/20 bg-red-bg p-3 text-sm text-red">{state.message}</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="mb-6">
					<label htmlFor="server-name" className="mb-1.5 block text-sm font-medium text-secondary">
						Server Name
					</label>
					<input
						id="server-name"
						type="text"
						value={serverName}
						onChange={(e) => setServerName(e.target.value)}
						required
						disabled={isSubmitting || isPending}
						className="form-input"
						placeholder="Enter server name..."
					/>
				</div>

				<div className="flex justify-end space-x-2">
					<Button
						type="button"
						variant="ghost"
						size="md"
						onClick={handleClose}
						disabled={isSubmitting || isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						size="md"
						disabled={isSubmitting || !serverName.trim() || isPending}
					>
						{isSubmitting ? (
							<>
								<LoadingSpinner size="sm" />
								Creating...
							</>
						) : (
							'Create Server'
						)}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
