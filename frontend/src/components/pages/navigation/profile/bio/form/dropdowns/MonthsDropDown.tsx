import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { MonthsDropDownProps } from "../../../../../../../interfaces";

export default function MonthsDropDown({
	handleMonthSelection
}: MonthsDropDownProps) {
	const months = [
		"",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	] as readonly string[];

	const [selectedMonth, setSelectedMonth] = useState(months[0]);

	return (
		<div className="absolute w-full bg-black p-1 overflow-y-auto min-h-auto max-h-40 top-14 rounded-md border border-slate-400 z-10">
			{months.map((month, index) => {
				return (
					<div
						className="flex hover:bg-zinc-800 hover:cursor-pointer"
						onClick={() => {
							setSelectedMonth(month);
							handleMonthSelection(month);
						}}
					>
						<div key={index} className={`p-2 ${month === "" && "h-9"}`}>
							{month}
						</div>
						{month === selectedMonth && (
							<div className="ml-auto p-2">
								<FontAwesomeIcon icon={faCheck} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
