'use client';

import { Configurations, ServerTab } from '@/lib/schemas/config';
import { ConfigurationEditor } from '@/components/configuration/ConfigurationEditor';
import { AssistRulesEditor } from '@/components/configuration/AssistRulesEditor';
import { EventConfigEditor } from '@/components/configuration/EventConfigEditor';
import { EventRulesEditor } from '@/components/configuration/EventRulesEditor';
import { ServerSettingsEditor } from '@/components/configuration/ServerSettingsEditor';
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard';
import { LeaderboardManager } from '@/components/leaderboard/LeaderboardManager';
import { ActivityLogTable } from '@/components/activityLog/ActivityLogTable';
import { useState } from 'react';
import { StateHistoryStats } from '@/lib/schemas';
import { Leaderboard } from '@/lib/schemas/leaderboard';
import { bulkUpdateConfigurationsAction } from '@/lib/actions/configuration';

interface ServerConfigurationTabsProps {
	serverId: string;
	configurations: Configurations;
	statistics: StateHistoryStats;
	leaderboard: Leaderboard;
}
const tabs = [
	{ id: ServerTab.statistics, name: 'Statistics', icon: '📊' },
	{ id: ServerTab.configuration, name: 'Configuration', icon: '⚙️' },
	{ id: ServerTab.assistRules, name: 'Assist Rules', icon: '🚗' },
	{ id: ServerTab.event, name: 'Event Config', icon: '🏁' },
	{ id: ServerTab.eventRules, name: 'Event Rules', icon: '📋' },
	{ id: ServerTab.settings, name: 'Server Settings', icon: '🔧' },
	{ id: ServerTab.leaderboard, name: 'Leaderboard', icon: '🏆' },
	{ id: ServerTab.activityLog, name: 'History', icon: '📋' }
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
	leaderboard
}: ServerConfigurationTabsProps) {
	const [currentTab, setCurrentTab] = useState(ServerTab.statistics);

	const [configData, setConfigData] = useState(configurations.configuration);
	const [assistData, setAssistData] = useState(configurations.assistRules);
	const [eventData, setEventData] = useState(configurations.event);
	const [eventRulesData, setEventRulesData] = useState(configurations.eventRules);
	const [settingsData, setSettingsData] = useState(configurations.settings);

	const [restart, setRestart] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const handleSaveAll = async () => {
		setIsSubmitting(true);
		setSaveError(null);
		setSaveSuccess(false);

		const result = await bulkUpdateConfigurationsAction(
			serverId,
			{
				configuration: configData,
				assistRules: assistData,
				event: eventData,
				eventRules: eventRulesData,
				settings: settingsData
			},
			restart
		);

		if (result.success) {
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
						onFormDataChange={setConfigData}
					/>
				);

			case ServerTab.assistRules:
				return (
					<AssistRulesEditor
						formData={assistData}
						disabled={isSubmitting}
						onFormDataChange={setAssistData}
					/>
				);

			case ServerTab.event:
				return (
					<EventConfigEditor
						formData={eventData}
						disabled={isSubmitting}
						onFormDataChange={setEventData}
					/>
				);

			case ServerTab.eventRules:
				return (
					<EventRulesEditor
						formData={eventRulesData}
						disabled={isSubmitting}
						onFormDataChange={setEventRulesData}
					/>
				);

			case ServerTab.settings:
				return (
					<ServerSettingsEditor
						formData={settingsData}
						disabled={isSubmitting}
						onFormDataChange={setSettingsData}
					/>
				);

			case ServerTab.leaderboard:
				return <LeaderboardManager serverId={serverId} initialData={leaderboard} />;

			case ServerTab.activityLog:
				return <ActivityLogTable serverId={serverId} />;

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
			<nav className="flex overflow-x-auto border-b border-border-muted px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Tabs">
				{tabs.map((tab) => {
					const isActive = currentTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => setCurrentTab(tab.id)}
							className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
								isActive
									? 'border-orange text-primary'
									: 'border-transparent text-muted hover:text-primary'
							}`}
						>
							<span className="text-sm">{tab.icon}</span>
							<span>{tab.name}</span>
						</button>
					);
				})}
			</nav>

			{isConfigTab && (
				<div className="flex items-center justify-between border-b border-border-muted bg-overlay px-5 py-3">
					<div className="flex items-center gap-3">
						{saveError && (
							<p className="text-sm text-red">{saveError}</p>
						)}
						{saveSuccess && (
							<p className="text-sm text-green">All configurations saved.</p>
						)}
					</div>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-2 text-sm text-muted">
							<input
								type="checkbox"
								checked={restart}
								onChange={(e) => setRestart(e.target.checked)}
								className="h-4 w-4 rounded border-border bg-overlay accent-green focus:ring-1 focus:ring-blue"
							/>
							Restart after saving
						</label>
						<button
							onClick={handleSaveAll}
							disabled={isSubmitting}
							className="rounded-md bg-btn-green border border-btn-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-btn-green-hover disabled:cursor-not-allowed disabled:opacity-40"
						>
							{isSubmitting ? 'Saving…' : 'Save All'}
						</button>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-y-auto p-5">{renderTabContent()}</div>
		</div>
	);
}
