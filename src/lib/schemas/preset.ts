import * as z from 'zod';

export const configPresetSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	configuration: z.string().nullable(),
	assistRules: z.string().nullable(),
	event: z.string().nullable(),
	eventRules: z.string().nullable(),
	settings: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export type ConfigPreset = z.infer<typeof configPresetSchema>;

export const PRESET_SECTION_LABELS: Record<string, string> = {
	configuration: 'Configuration',
	assistRules: 'Assist Rules',
	event: 'Event Config',
	eventRules: 'Event Rules',
	settings: 'Server Settings'
};

export function getPresetSections(preset: ConfigPreset): string[] {
	const sections: string[] = [];
	if (preset.configuration) sections.push('configuration');
	if (preset.assistRules) sections.push('assistRules');
	if (preset.event) sections.push('event');
	if (preset.eventRules) sections.push('eventRules');
	if (preset.settings) sections.push('settings');
	return sections;
}
