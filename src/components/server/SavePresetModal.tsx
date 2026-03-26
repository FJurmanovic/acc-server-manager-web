'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createPresetAction } from '@/lib/actions/presets';
import type { Configurations } from '@/lib/schemas/config';
import { PRESET_SECTION_LABELS } from '@/lib/schemas/preset';

type SectionKey = keyof Configurations;

const ALL_SECTIONS: SectionKey[] = ['configuration', 'assistRules', 'event', 'eventRules', 'settings'];

interface SavePresetModalProps {
	isOpen: boolean;
	onClose: () => void;
	configurations: Configurations;
}

export function SavePresetModal({ isOpen, onClose, configurations }: SavePresetModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [selectedSections, setSelectedSections] = useState<Set<SectionKey>>(
		new Set(ALL_SECTIONS)
	);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	const toggleSection = (key: SectionKey) =>
		setSelectedSections((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});

	const handleClose = () => {
		if (isSaving) return;
		setName('');
		setDescription('');
		setSelectedSections(new Set(ALL_SECTIONS));
		setError(null);
		setSaved(false);
		onClose();
	};

	const handleSave = async () => {
		if (!name.trim() || selectedSections.size === 0) return;
		setIsSaving(true);
		setError(null);

		const result = await createPresetAction({
			name: name.trim(),
			description: description.trim() || undefined,
			configuration: selectedSections.has('configuration') ? (configurations.configuration as Record<string, unknown>) : null,
			assistRules: selectedSections.has('assistRules') ? (configurations.assistRules as Record<string, unknown>) : null,
			event: selectedSections.has('event') ? (configurations.event as Record<string, unknown>) : null,
			eventRules: selectedSections.has('eventRules') ? (configurations.eventRules as Record<string, unknown>) : null,
			settings: selectedSections.has('settings') ? (configurations.settings as Record<string, unknown>) : null
		});

		setIsSaving(false);

		if (!result.success) {
			setError(result.message);
			return;
		}

		setSaved(true);
		setTimeout(() => handleClose(), 1200);
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Save as Preset">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-secondary">Name *</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Sprint Race — Spa"
						className="form-input text-sm"
						disabled={isSaving || saved}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-secondary">Description</label>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Optional description..."
						className="form-input text-sm"
						disabled={isSaving || saved}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-xs font-medium text-secondary">Include sections</label>
					<div className="flex flex-col gap-1.5">
						{ALL_SECTIONS.map((key) => (
							<label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm text-secondary">
								<input
									type="checkbox"
									checked={selectedSections.has(key)}
									onChange={() => toggleSection(key)}
									disabled={isSaving || saved}
									className="h-4 w-4 rounded border-border bg-overlay accent-orange"
								/>
								{PRESET_SECTION_LABELS[key]}
							</label>
						))}
					</div>
				</div>

				{error && <p className="text-sm text-red">{error}</p>}
				{saved && <p className="text-sm text-green">Preset saved!</p>}

				<div className="flex justify-end gap-2">
					<Button variant="ghost" size="md" onClick={handleClose} disabled={isSaving}>
						Cancel
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={handleSave}
						disabled={!name.trim() || selectedSections.size === 0 || isSaving || saved}
					>
						{isSaving ? (
							<>
								<LoadingSpinner size="sm" />
								Saving…
							</>
						) : (
							'Save Preset'
						)}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
