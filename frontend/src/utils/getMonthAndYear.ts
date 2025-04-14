export default function getMonthAndYear(isoString: Date | undefined) {
	if (isoString) {
		const date = new Date(isoString);
		const year = date.getFullYear();
		const month = date.toLocaleString("default", { month: "long" });
		return { month, year };
	}
}
