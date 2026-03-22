'use client';

import type { Configuration } from '@/lib/schemas/config';

interface ConfigurationEditorProps {
	formData: Configuration;
	disabled?: boolean;
	onFormDataChange: (data: Configuration) => void;
}

export function ConfigurationEditor({ formData, disabled, onFormDataChange }: ConfigurationEditorProps) {
	const handleInputChange = (key: keyof Configuration, value: string | number) => {
		onFormDataChange({
			...formData,
			[key]: typeof value === 'string' ? parseInt(value) : value
		});
	};

	return (
		<div className="max-w-3xl space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">UDP Port</label>
					<input
						type="number"
						disabled={disabled}
						value={formData.udpPort}
						onChange={(e) => handleInputChange('udpPort', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">TCP Port</label>
					<input
						type="number"
						disabled={disabled}
						value={formData.tcpPort}
						onChange={(e) => handleInputChange('tcpPort', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">Max Connections</label>
					<input
						type="number"
						disabled={disabled}
						value={formData.maxConnections}
						onChange={(e) => handleInputChange('maxConnections', e.target.value)}
						className="form-input w-full"
					/>
				</div>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-secondary">LAN Discovery</label>
					<select
						disabled={disabled}
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
						disabled={disabled}
						value={formData.registerToLobby}
						onChange={(e) => handleInputChange('registerToLobby', e.target.value)}
						className="form-select w-full"
					>
						<option value={0}>No</option>
						<option value={1}>Yes</option>
					</select>
				</div>
			</div>
		</div>
	);
}
