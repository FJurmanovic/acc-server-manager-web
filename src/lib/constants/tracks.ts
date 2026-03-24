export const TRACKS: Record<string, string> = {
	barcelona: 'Barcelona',
	brands_hatch: 'Brands Hatch',
	cota: 'COTA',
	donington: 'Donington',
	hungaroring: 'Hungaroring',
	imola: 'Imola',
	indianapolis: 'Indianapolis',
	kyalami: 'Kyalami',
	laguna_seca: 'Laguna Seca',
	misano: 'Misano',
	monza: 'Monza',
	mount_panorama: 'Mount Panorama',
	nurburgring: 'Nürburgring',
	nurburgring_24h: 'Nürburgring 24h',
	oulton_park: 'Oulton Park',
	paul_ricard: 'Paul Ricard',
	red_bull_ring: 'Red Bull Ring',
	silverstone: 'Silverstone',
	snetterton: 'Snetterton',
	spa: 'Spa-Francorchamps',
	suzuka: 'Suzuka',
	valencia: 'Valencia',
	watkins_glen: 'Watkins Glen',
	zandvoort: 'Zandvoort',
	zolder: 'Zolder'
};

export function getTrackDisplayName(key: string): string {
	return TRACKS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
