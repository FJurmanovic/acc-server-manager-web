'use client';

import { type Configurations, ServerTab } from '@/lib/schemas/config';
import { ConfigurationEditor } from '@/components/configuration/ConfigurationEditor';
import { AssistRulesEditor } from '@/components/configuration/AssistRulesEditor';
import { EventConfigEditor } from '@/components/configuration/EventConfigEditor';
import { EventRulesEditor } from '@/components/configuration/EventRulesEditor';
import { ServerSettingsEditor } from '@/components/configuration/ServerSettingsEditor';
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard';
import { LeaderboardManager } from '@/components/leaderboard/LeaderboardManager';
import { ActivityLogTable } from '@/components/activityLog/ActivityLogTable';
import { ServerLogViewer } from '@/components/server/ServerLogViewer';
import { PresetPickerModal } from '@/components/server/PresetPickerModal';
import { SavePresetModal } from '@/components/server/SavePresetModal';
import { useState } from 'react';
import { StateHistoryStats, hasPermission, type User } from '@/lib/schemas';
import { Leaderboard } from '@/lib/schemas/leaderboard';
import {
	bulkUpdateConfigurationsAction,
	getConfigurationsAction
} from '@/lib/actions/configuration';

interface ServerConfigurationTabsProps {
	serverId: string;
	configurations: Configurations;
	statistics: StateHistoryStats;
	leaderboard: Leaderboard;
	user: User;
}
const tabs = [
	{ id: ServerTab.statistics, name: 'Statistics', icon: '📊' },
	{ id: ServerTab.configuration, name: 'Configuration', icon: '⚙️' },
	{ id: ServerTab.assistRules, name: 'Assist Rules', icon: '🚗' },
	{ id: ServerTab.event, name: 'Event Config', icon: '🏁' },
	{ id: ServerTab.eventRules, name: 'Event Rules', icon: '📋' },
	{ id: ServerTab.settings, name: 'Server Settings', icon: '🔧' },
	{ id: ServerTab.leaderboard, name: 'Leaderboard', icon: '🏆' },
	{ id: ServerTab.activityLog, name: 'History', icon: '📋' },
	{ id: ServerTab.logs, name: 'Logs', icon: '📄' }
];

const configTabs = new Set([
	ServerTab.configuration,
	ServerTab.assistRules,
	ServerTab.event,
	ServerTab.eventRules,
	ServerTab.settings
]);

export function ServerConfigurationTabs({
	serverId,
	configurations,
	statistics,
	leaderboard,
	user
}: ServerConfigurationTabsProps) {
	const canViewPresets = hasPermission(user, 'preset.view');
	const canCreatePresets = hasPermission(user, 'preset.create');
	const [currentTab, setCurrentTab] = useState(ServerTab.statistics);

	const [configData, setConfigData] = useState(configurations.configuration);
	const [assistData, setAssistData] = useState(configurations.assistRules);
	const [eventData, setEventData] = useState(configurations.event);
	const [eventRulesData, setEventRulesData] = useState(configurations.eventRules);
	const [settingsData, setSettingsData] = useState(configurations.settings);
	const [dirtyConfigs, setDirtyConfigs] = useState<Set<keyof Configurations>>(new Set());

	const [restart, setRestart] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
	const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState(false);

	const reloadConfigs = async () => {
		const result = await getConfigurationsAction(serverId);
		if (!result.success) return;
		setConfigData(result.data.configuration);
		setAssistData(result.data.assistRules);
		setEventData(result.data.event);
		setEventRulesData(result.data.eventRules);
		setSettingsData(result.data.settings);
		setDirtyConfigs(new Set());
	};

	const markDirty = (key: keyof Configurations) =>
		setDirtyConfigs((prev) => new Set(prev).add(key));

	const handleSaveAll = async () => {
		if (dirtyConfigs.size === 0) return;

		setIsSubmitting(true);
		setSaveError(null);
		setSaveSuccess(false);

		const payload: Partial<Configurations> = {};
		if (dirtyConfigs.has('configuration')) payload.configuration = configData;
		if (dirtyConfigs.has('assistRules')) payload.assistRules = assistData;
		if (dirtyConfigs.has('event')) payload.event = eventData;
		if (dirtyConfigs.has('eventRules')) payload.eventRules = eventRulesData;
		if (dirtyConfigs.has('settings')) payload.settings = settingsData;

		const result = await bulkUpdateConfigurationsAction(serverId, payload, restart);

		if (result.success) {
			setDirtyConfigs(new Set());
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} else {
			setSaveError(result.message);
		}

		setIsSubmitting(false);
	};

	const isConfigTab = configTabs.has(currentTab);

	const renderTabContent = () => {
		switch (currentTab) {
			case ServerTab.statistics:
				return <StatisticsDashboard stats={statistics} />;

			case ServerTab.configuration:
				return (
					<ConfigurationEditor
						formData={configData}
						disabled={isSubmitting}
						onFormDataChange={(data) => {
							setConfigData(data);
							markDirty('configuration');
						}}
					/>
				);

			case ServerTab.assistRules:
				return (
					<AssistRulesEditor
						formData={assistData}
						disabled={isSubmitting}
						onFormDataChange={(data) => {
							setAssistData(data);
							markDirty('assistRules');
						}}
					/>
				);

			case ServerTab.event:
				return (
					<EventConfigEditor
						formData={eventData}
						disabled={isSubmitting}
						onFormDataChange={(data) => {
							setEventData(data);
							markDirty('event');
						}}
					/>
				);

			case ServerTab.eventRules:
				return (
					<EventRulesEditor
						formData={eventRulesData}
						disabled={isSubmitting}
						onFormDataChange={(data) => {
							setEventRulesData(data);
							markDirty('eventRules');
						}}
					/>
				);

			case ServerTab.settings:
				return (
					<ServerSettingsEditor
						formData={settingsData}
						disabled={isSubmitting}
						onFormDataChange={(data) => {
							setSettingsData(data);
							markDirty('settings');
						}}
					/>
				);

			case ServerTab.leaderboard:
				return <LeaderboardManager serverId={serverId} initialData={leaderboard} />;

			case ServerTab.activityLog:
				return <ActivityLogTable serverId={serverId} />;

			case ServerTab.logs:
				return <ServerLogViewer serverId={serverId} />;

			default:
				return (
					<div className="py-12 text-center">
						<div className="mb-4 text-6xl">🚧</div>
						<h3 className="mb-2 text-xl font-semibold text-white">Tab Not Found</h3>
						<p className="text-gray-400">The requested tab could not be found.</p>
					</div>
				);
		}
	};

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<nav
				className="border-border-muted flex overflow-x-auto border-b px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				aria-label="Tabs"
			>
				{tabs.map((tab) => {
					const isActive = currentTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => setCurrentTab(tab.id)}
							className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
								isActive
									? 'border-orange text-primary'
									: 'text-muted hover:text-primary border-transparent'
							}`}
						>
							<span className="text-sm">{tab.icon}</span>
							<span>{tab.name}</span>
						</button>
					);
				})}
			</nav>

			{isConfigTab && (
				<div className="border-border-muted bg-overlay flex items-center justify-between border-b px-5 py-3">
					<div className="flex items-center gap-3">
						{saveError && (
						<ul className="flex flex-col gap-0.5">
							{saveError.split('\n').map((line, i) => (
								<li key={i} className="text-red text-sm">• {line}</li>
							))}
						</ul>
					)}
						{saveSuccess && <p className="text-green text-sm">All configurations saved.</p>}
					</div>
					<div className="flex items-center gap-4">
						<label className="text-muted flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={restart}
								onChange={(e) => setRestart(e.target.checked)}
								className="border-border bg-overlay accent-green focus:ring-blue h-4 w-4 rounded focus:ring-1"
							/>
							Restart after saving
						</label>
						{canCreatePresets && (
							<button
								onClick={() => setIsSavePresetModalOpen(true)}
								disabled={isSubmitting}
								className="border-border text-secondary hover:bg-hover rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
							>
								Save as Preset
							</button>
						)}
						{canViewPresets && (
							<button
								onClick={() => setIsPresetModalOpen(true)}
								disabled={isSubmitting}
								className="border-border text-secondary hover:bg-hover rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
							>
								Load Preset
							</button>
						)}
						<button
							onClick={handleSaveAll}
							disabled={isSubmitting || dirtyConfigs.size === 0}
							className="bg-btn-green border-btn-green hover:bg-btn-green-hover rounded-md border px-5 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
						>
							{isSubmitting ? 'Saving…' : 'Save All'}
						</button>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-y-auto p-5">{renderTabContent()}</div>

			<SavePresetModal
				isOpen={isSavePresetModalOpen}
				onClose={() => setIsSavePresetModalOpen(false)}
				configurations={{
					configuration: configData,
					assistRules: assistData,
					event: eventData,
					eventRules: eventRulesData,
					settings: settingsData
				}}
			/>

			<PresetPickerModal
				isOpen={isPresetModalOpen}
				onClose={() => setIsPresetModalOpen(false)}
				serverId={serverId}
				onApplied={async () => {
					await reloadConfigs();
					setSaveSuccess(true);
					setTimeout(() => setSaveSuccess(false), 3000);
				}}
			/>
		</div>
	);
}
