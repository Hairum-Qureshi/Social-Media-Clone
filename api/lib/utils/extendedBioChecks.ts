import { Response } from "express";

export function extendedBioChecks(
	jobTitle: string,
	companyName: String,
	location: string,
	startDate: string,
	isCurrentlyWorkingHere: boolean,
	endDate: string,
	res: Response
) {
	if (!jobTitle || !companyName || !location || !startDate) {
		res.status(400).json({ message: "Please fill in all required fields" });
		return;
	}

	if (!isCurrentlyWorkingHere && (!startDate || !endDate)) {
		res.status(400).json({
			message: "Please make sure to provide both start and end dates"
		});
		return;
	}

	if (isCurrentlyWorkingHere && !startDate) {
		res.status(400).json({ message: "Please provide a start date" });
		return;
	}

	if (isCurrentlyWorkingHere && endDate) {
		// This case may never happen because the frontend disables the drop downs for the end dates; however, it's added just incase the user somehow bypasses it in the frontend
		res.status(400).json({ message: "Please remove the end date" });
		return;
	}
}
