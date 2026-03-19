'use client';

import { useState } from 'react';
import type { Configuration } from '@/lib/schemas/config';
import { updateConfigurationAction } from '@/lib/actions/configuration';

interface ConfigurationEditorProps {
	serverId: string;
	config: Configuration;
}

export function ConfigurationEditor({ serverId, config }: ConfigurationEditorProps) {
	const [formData, setFormData] = useState<Configuration>(config);
	const [restart, setRestart] = useState(true);
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
		setFormData((prev) => ({
			...prev,
			[key]: typeof value === 'string' ? parseInt(value) : value
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">UDP Port</label>
					<input
						type="number"
						disabled={isSubmitting}
						value={formData.udpPort}
						onChange={(e) => handleInputChange('udpPort', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">TCP Port</label>
					<input
						type="number"
						disabled={isSubmitting}
						value={formData.tcpPort}
						onChange={(e) => handleInputChange('tcpPort', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Max Connections</label>
					<input
						type="number"
						disabled={isSubmitting}
						value={formData.maxConnections}
						onChange={(e) => handleInputChange('maxConnections', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">LAN Discovery</label>
					<select
						disabled={isSubmitting}
						value={formData.lanDiscovery}
						onChange={(e) => handleInputChange('lanDiscovery', e.target.value)}
						className="form-input w-full"
					>
						<option value={0}>No</option>
						<option value={1}>Yes</option>
					</select>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-300">Register To Lobby</label>
					<select
						disabled={isSubmitting}
						value={formData.registerToLobby}
						onChange={(e) => handleInputChange('registerToLobby', e.target.value)}
						className="form-input w-full"
					>
						<option value={0}>No</option>
						<option value={1}>Yes</option>
					</select>
				</div>
			</div>

			<div className="border-t border-gray-700 pt-6">
				<label className="flex items-center">
					<input
						type="checkbox"
						checked={restart}
						onChange={(e) => setRestart(e.target.checked)}
						className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-green-500"
					/>
					<span className="ml-2 text-sm text-gray-300">Restart server after saving</span>
				</label>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	);
}
