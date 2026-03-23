import { fetchServerAPI } from './base';
import {
	activityLogSchema,
	type ActivityLog,
	type ActivityLogFilter
} from '@/lib/schemas/activityLog';

function buildQuery(filter?: ActivityLogFilter): string {
	if (!filter) return '';
	const params = new URLSearchParams();
	if (filter.page !== undefined) params.set('page', String(filter.page));
	if (filter.page_size !== undefined) params.set('page_size', String(filter.page_size));
	if (filter.sort_by) params.set('sort_by', filter.sort_by);
	if (filter.sort_desc !== undefined) params.set('sort_desc', String(filter.sort_desc));
	if (filter.user_id) params.set('user_id', filter.user_id);
	if (filter.server_id) params.set('server_id', filter.server_id);
	if (filter.action) params.set('action', filter.action);
	if (filter.start_date) params.set('start_date', filter.start_date);
	if (filter.end_date) params.set('end_date', filter.end_date);
	const str = params.toString();
	return str ? `?${str}` : '';
}

export async function getActivityLog(
	token: string,
	filter?: ActivityLogFilter
): Promise<ActivityLog[]> {
	const query = buildQuery(filter);
	const response = await fetchServerAPI<ActivityLog[]>(`/activity-log${query}`, token);
	return activityLogSchema.array().parse(response.data);
}
