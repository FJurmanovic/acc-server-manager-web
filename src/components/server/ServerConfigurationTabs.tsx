'use client';

import { Configurations, ServerTab } from '@/lib/schemas/config';
import { ConfigurationEditor } from '@/components/configuration/ConfigurationEditor';
import { AssistRulesEditor } from '@/components/configuration/AssistRulesEditor';
import { EventConfigEditor } from '@/components/configuration/EventConfigEditor';
import { EventRulesEditor } from '@/components/configuration/EventRulesEditor';
import { ServerSettingsEditor } from '@/components/configuration/ServerSettingsEditor';
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard';
import { LeaderboardManager } from '@/components/leaderboard/LeaderboardManager';
import { useState } from 'react';
import { StateHistoryStats } from '@/lib/schemas';
import { Leaderboard } from '@/lib/schemas/leaderboard';

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
	{ id: ServerTab.leaderboard, name: 'Leaderboard', icon: '🏆' }
];

export function ServerConfigurationTabs({
	serverId,
	configurations,
	statistics,
	leaderboard
}: ServerConfigurationTabsProps) {
	const [currentTab, setCurrentTab] = useState(ServerTab.statistics);

	const renderTabContent = () => {
		switch (currentTab) {
			case ServerTab.statistics:
				return <StatisticsDashboard stats={statistics} />;

			case ServerTab.configuration:
				return <ConfigurationEditor serverId={serverId} config={configurations.configuration} />;

			case ServerTab.assistRules:
				return <AssistRulesEditor serverId={serverId} config={configurations.assistRules} />;

			case ServerTab.event:
				return <EventConfigEditor serverId={serverId} config={configurations.event} />;

			case ServerTab.eventRules:
				return <EventRulesEditor serverId={serverId} config={configurations.eventRules} />;

			case ServerTab.settings:
				return <ServerSettingsEditor serverId={serverId} config={configurations.settings} />;

			case ServerTab.leaderboard:
				return <LeaderboardManager serverId={serverId} initialData={leaderboard} />;

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
			<nav className="flex overflow-x-auto border-b border-gh-border-muted px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Tabs">
				{tabs.map((tab) => {
					const isActive = currentTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => setCurrentTab(tab.id)}
							className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
								isActive
									? 'border-gh-orange text-gh-primary'
									: 'border-transparent text-gh-muted hover:text-gh-primary'
							}`}
						>
							<span className="text-sm">{tab.icon}</span>
							<span>{tab.name}</span>
						</button>
					);
				})}
			</nav>

			<div className="flex-1 overflow-y-auto p-5">{renderTabContent()}</div>
		</div>
	);
}
