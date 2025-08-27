'use client';

import { Configurations, ServerTab } from '@/lib/types/config';
import { ConfigurationEditor } from '@/components/configuration/ConfigurationEditor';
import { AssistRulesEditor } from '@/components/configuration/AssistRulesEditor';
import { EventConfigEditor } from '@/components/configuration/EventConfigEditor';
import { EventRulesEditor } from '@/components/configuration/EventRulesEditor';
import { ServerSettingsEditor } from '@/components/configuration/ServerSettingsEditor';
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard';
import { useState } from 'react';
import { StateHistoryStats } from '@/lib/types';

interface ServerConfigurationTabsProps {
	serverId: string;
	configurations: Configurations;
	statistics: StateHistoryStats;
}

export function ServerConfigurationTabs({
	serverId,
	configurations,
	statistics
}: ServerConfigurationTabsProps) {
	const [currentTab, setCurrentTab] = useState(ServerTab.statistics);
	const tabs = [
		{ id: ServerTab.statistics, name: 'Statistics', icon: '📊' },
		{ id: ServerTab.configuration, name: 'Configuration', icon: '⚙️' },
		{ id: ServerTab.assistRules, name: 'Assist Rules', icon: '🚗' },
		{ id: ServerTab.event, name: 'Event Config', icon: '🏁' },
		{ id: ServerTab.eventRules, name: 'Event Rules', icon: '📋' },
		{ id: ServerTab.settings, name: 'Server Settings', icon: '🔧' }
	];

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
		<div className="overflow-hidden rounded-lg bg-gray-800">
			<div className="border-b border-gray-700">
				<nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
					{tabs.map((tab) => {
						const isActive = currentTab === tab.id;
						return (
							<button
								key={tab.id}
								onClick={() => setCurrentTab(tab.id)}
								className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
									isActive
										? 'border-blue-500 text-blue-400'
										: 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
								} `}
							>
								<span className="text-base">{tab.icon}</span>
								<span>{tab.name}</span>
							</button>
						);
					})}
				</nav>
			</div>

			<div className="p-6">{renderTabContent()}</div>
		</div>
	);
}
