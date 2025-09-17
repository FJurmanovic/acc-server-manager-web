'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createServerAction, type ServerActionResult } from '@/lib/actions/server-management';
import { useServerCreationPopup } from '@/lib/context/ServerCreationPopupContext';

interface CreateServerModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const initialState: ServerActionResult = { success: false, message: '' };

export function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
	const [serverName, setServerName] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [state, formAction] = useFormState(createServerAction, initialState);
	const { showPopup } = useServerCreationPopup();

	useEffect(() => {
		if (state.success && state.data?.id) {
			// Server creation started, show popup
			showPopup(state.data.id, serverName);
			onClose();
			setServerName('');
			setIsSubmitting(false);
		}
	}, [state.success, state.data, showPopup, serverName, onClose]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!serverName.trim()) {
			return;
		}

		setIsSubmitting(true);
		const formData = new FormData();
		formData.append('name', serverName.trim());
		formAction(formData);
	};

	const handleClose = () => {
		if (isSubmitting) {
			return; // Prevent closing during submission
		}
		onClose();
		setServerName('');
		setIsSubmitting(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Create New Server">
			{!state.success && state.message && (
				<div className="mb-4 rounded-md bg-red-900 p-3 text-sm text-red-300">{state.message}</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="mb-6">
					<label htmlFor="server-name" className="block text-sm font-medium text-gray-300">
						Server Name
					</label>
					<input
						id="server-name"
						type="text"
						value={serverName}
						onChange={(e) => setServerName(e.target.value)}
						required
						disabled={isSubmitting}
						className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
						placeholder="Enter server name..."
					/>
				</div>

				<div className="flex justify-end space-x-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isSubmitting}
						className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting || !serverName.trim()}
						className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-green-700 disabled:opacity-50"
					>
						{isSubmitting ? (
							<>
								<LoadingSpinner className="mr-2 h-4 w-4" />
								Creating...
							</>
						) : (
							'Create Server'
						)}
					</button>
				</div>
			</form>
		</Modal>
	);
}
