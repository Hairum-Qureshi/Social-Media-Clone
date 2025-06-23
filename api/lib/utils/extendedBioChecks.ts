import { Response } from "express";

function isValidDateRange(start: string, end: string): boolean {
	const startDate = parseMonthYear(start);
	const endDate = parseMonthYear(end);

	if (!startDate || !endDate) return false; // invalid inputs

	return endDate >= startDate;
}

function parseMonthYear(input: string): Date | null {
	const parsed = new Date(input);
	return isNaN(parsed.getTime()) ? null : parsed;
}

export function extendedBioChecks(
	jobTitle: string,
	companyName: String,
	location: string,
	startDate: string,
	isCurrentlyWorkingHere: boolean,
	endDate: string,
	res: Response
) {
	// By default, the start and end years are already provided, but the months are not
	const emptyStartDate =
		!startDate.split(" ")[0] &&
		startDate.split(" ")[1] === new Date().getFullYear().toString(); // if no month is provided and just the current year
	const emptyEndDate =
		!endDate.split(" ")[0] &&
		endDate.split(" ")[1] === new Date().getFullYear().toString(); // if no month is provided and just the current year

	if (
		!jobTitle.trim() ||
		!companyName.trim() ||
		!location.trim() ||
		emptyStartDate
	) {
		res.status(400).json({ message: "Please fill in all required fields" });
		return;
	}

	if (!isCurrentlyWorkingHere && (emptyStartDate || emptyEndDate)) {
		res.status(400).json({
			message: "Please make sure to provide both start and end dates"
		});
		return;
	}

	if (isCurrentlyWorkingHere && emptyStartDate) {
		res.status(400).json({ message: "Please provide a start date" });
		return;
	}

	if (isCurrentlyWorkingHere && !emptyEndDate) {
		// This case may never happen because the frontend disables the drop downs for the end dates; however, it's added just incase the user somehow bypasses it in the frontend
		res.status(400).json({ message: "Please remove the end date" });
		return;
	}

	if (!isCurrentlyWorkingHere) {
		// ensures chronological date consistency (i.e. end date cannot be less than start date)
		if (!isValidDateRange(startDate, endDate)) {
			res.status(400).json({ message: "Invalid date range" });
			return;
		}
	}
}
