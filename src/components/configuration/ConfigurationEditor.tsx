'use client';

import { useState } from 'react';
import type { Configuration } from '@/lib/schemas/config';
import { updateConfigurationAction } from '@/lib/actions/configuration';

interface ConfigurationEditorProps {
	serverId: string;
	formData: Configuration;
	restart: boolean;
	onFormDataChange: (data: Configuration) => void;
	onRestartChange: (restart: boolean) => void;
}

export function ConfigurationEditor({ serverId, formData, restart, onFormDataChange, onRestartChange }: ConfigurationEditorProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formDataObj = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			formDataObj.append(key, value.toString());
		});
		if (restart) {
			formDataObj.append('restart', 'on');
		}

		try {
			const result = await updateConfigurationAction(serverId, formDataObj);
			if (!result.success) {
				console.error('Failed to update configuration:', result.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (key: keyof Configuration, value: string | number) => {
		onFormDataChange({
			...formData,
			[key]: typeof value === 'string' ? parseInt(value) : value
		});
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">UDP Port</label>
					<input
						type="number"
						disabled={isSubmitting}
						value={formData.udpPort}
						onChange={(e) => handleInputChange('udpPort', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">TCP Port</label>
					<input
						type="number"
						disabled={isSubmitting}
						value={formData.tcpPort}
						onChange={(e) => handleInputChange('tcpPort', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">Max Connections</label>
					<input
						type="number"
						disabled={isSubmitting}
						value={formData.maxConnections}
						onChange={(e) => handleInputChange('maxConnections', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">LAN Discovery</label>
					<select
						disabled={isSubmitting}
						value={formData.lanDiscovery}
						onChange={(e) => handleInputChange('lanDiscovery', e.target.value)}
						className="form-select w-full"
					>
						<option value={0}>No</option>
						<option value={1}>Yes</option>
					</select>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">Register To Lobby</label>
					<select
						disabled={isSubmitting}
						value={formData.registerToLobby}
						onChange={(e) => handleInputChange('registerToLobby', e.target.value)}
						className="form-select w-full"
					>
						<option value={0}>No</option>
						<option value={1}>Yes</option>
					</select>
				</div>
			</div>

			<div className="border-t border-border pt-6">
				<label className="flex items-center gap-2 text-sm text-muted">
					<input
						type="checkbox"
						checked={restart}
						onChange={(e) => onRestartChange(e.target.checked)}
						className="h-4 w-4 rounded border-border bg-overlay accent-green focus:ring-1 focus:ring-blue"
					/>
					Restart server after saving
				</label>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-btn-green border border-btn-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-btn-green-hover disabled:cursor-not-allowed disabled:opacity-40"
				>
					{isSubmitting ? 'Saving…' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
}
