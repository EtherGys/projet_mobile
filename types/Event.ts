export interface EventItem {
	id: string;
	title: string;
	description: string;
	date: string; // ISO string yyyy-MM-dd for calendar mapping
	participated?: boolean;
}


