export function formatDateDDMMYYYY(isoDate: string | null | undefined): string {
	if (!isoDate) return '';
	// Expected isoDate as yyyy-MM-dd
	const parts = isoDate.split('-');
	if (parts.length !== 3) return isoDate;
	const [y, m, d] = parts;
	return `${d}/${m}/${y}`;
}


