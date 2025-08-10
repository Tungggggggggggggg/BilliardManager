export function formatDateTime(dateTimeString: string): string {
	if (!dateTimeString) return '';
	let date = '', time = '';
	if (dateTimeString.includes('T')) {
		[date, time] = dateTimeString.split('T');
		time = time ? time.substring(0, 5) : '';
	} else if (dateTimeString.includes(' ')) {
		[date, time] = dateTimeString.split(' ');
		time = time ? time.substring(0, 5) : '';
	} else {
		date = dateTimeString;
		time = '';
	}
	const [year, month, day] = date.split('-');
	const formattedDate = day && month && year ? `${day}/${month}/${year}` : date;
	return `${time} ${formattedDate}`.trim();
}
