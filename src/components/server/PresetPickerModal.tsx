'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { listPresetsAction, applyPresetAction } from '@/lib/actions/presets';
import type { ConfigPreset } from '@/lib/schemas/preset';
import { PRESET_SECTION_LABELS, getPresetSections } from '@/lib/schemas/preset';

interface PresetPickerModalProps {
	isOpen: boolean;
	onClose: () => void;
	serverId: string;
	onApplied: () => void;
}

export function PresetPickerModal({ isOpen, onClose, serverId, onApplied }: PresetPickerModalProps) {
	const [presets, setPresets] = useState<ConfigPreset[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [selected, setSelected] = useState<string | null>(null);
	const [restart, setRestart] = useState(false);
	const [isApplying, setIsApplying] = useState(false);
	const [applyError, setApplyError] = useState<string | null>(null);
	const [search, setSearch] = useState('');

	const loadPresets = useCallback(async () => {
		setIsLoading(true);
		setLoadError(null);
		const result = await listPresetsAction();
		setIsLoading(false);
		if (!result.success) {
			setLoadError(result.message);
			return;
		}
		setPresets(result.data);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setSelected(null);
			setApplyError(null);
			setSearch('');
			loadPresets();
		}
	}, [isOpen, loadPresets]);

	const filtered = presets.filter((p) =>
		p.name.toLowerCase().includes(search.toLowerCase()) ||
		p.description.toLowerCase().includes(search.toLowerCase())
	);

	const handleApply = async () => {
		if (!selected) return;
		setIsApplying(true);
		setApplyError(null);
		const result = await applyPresetAction(serverId, selected, restart);
		setIsApplying(false);
		if (!result.success) {
			setApplyError(result.message);
			return;
		}
		onApplied();
		onClose();
	};

	const selectedPreset = presets.find((p) => p.id === selected);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Load Config Preset" className="max-w-lg">
			<div className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="Search presets..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="form-input text-sm"
				/>

				{loadError && <p className="text-sm text-red">{loadError}</p>}

				<div className="max-h-64 overflow-y-auto rounded-md border border-border">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<LoadingSpinner size="sm" />
						</div>
					) : filtered.length === 0 ? (
						<div className="py-8 text-center text-sm text-muted">
							{presets.length === 0 ? 'No presets saved yet.' : 'No presets match your search.'}
						</div>
					) : (
						<ul>
							{filtered.map((preset) => {
								const sections = getPresetSections(preset);
								const isSelected = selected === preset.id;
								return (
									<li
										key={preset.id}
										onClick={() => setSelected(preset.id)}
										className={`cursor-pointer border-b border-border-muted px-4 py-3 transition-colors last:border-0 ${
											isSelected
												? 'bg-orange/10'
												: 'hover:bg-hover'
										}`}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0">
												<p className={`truncate text-sm font-medium ${isSelected ? 'text-orange' : 'text-primary'}`}>
													{preset.name}
												</p>
												{preset.description && (
													<p className="mt-0.5 truncate text-xs text-muted">{preset.description}</p>
												)}
											</div>
											<div className="shrink-0 text-right">
												{sections.length > 0 ? (
													<p className="text-xs text-muted">{sections.length} section{sections.length !== 1 ? 's' : ''}</p>
												) : (
													<p className="text-xs text-muted/50">Empty</p>
												)}
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>

				{selectedPreset && (
					<div className="rounded-md border border-border-muted bg-overlay px-4 py-3">
						<p className="mb-2 text-xs font-medium text-secondary">Sections in this preset:</p>
						<div className="flex flex-wrap gap-1.5">
							{getPresetSections(selectedPreset).map((key) => (
								<span
									key={key}
									className="rounded-full bg-blue-bg px-2 py-0.5 text-xs text-blue"
								>
									{PRESET_SECTION_LABELS[key] ?? key}
								</span>
							))}
							{getPresetSections(selectedPreset).length === 0 && (
								<span className="text-xs text-muted">No sections — nothing will be applied.</span>
							)}
						</div>
					</div>
				)}

				{applyError && <p className="text-sm text-red">{applyError}</p>}

				<div className="flex items-center justify-between">
					<label className="flex items-center gap-2 text-sm text-muted">
						<input
							type="checkbox"
							checked={restart}
							onChange={(e) => setRestart(e.target.checked)}
							className="h-4 w-4 rounded border-border bg-overlay accent-green focus:ring-1 focus:ring-blue"
						/>
						Restart after applying
					</label>

					<div className="flex gap-2">
						<Button variant="ghost" size="md" onClick={onClose} disabled={isApplying}>
							Cancel
						</Button>
						<Button
							variant="primary"
							size="md"
							onClick={handleApply}
							disabled={!selected || isApplying}
						>
							{isApplying ? (
								<>
									<LoadingSpinner size="sm" />
									Applying…
								</>
							) : (
								'Apply Preset'
							)}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
