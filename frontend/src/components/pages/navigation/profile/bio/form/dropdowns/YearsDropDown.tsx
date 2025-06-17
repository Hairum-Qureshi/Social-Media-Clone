import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function YearsDropDown({ handleYearSelection }: YearsDropDownProps) {
	const [selectedYear, setSelectedYear] = useState("");
	const [years, setYears] = useState<string[]>([]);

	useEffect(() => {
		const years: string[] = [];
		for (let year = new Date().getFullYear(); year >= 1905; year--) {
			years.push(year.toString());
		}

		setYears(years);
	}, []);

	return (
		<div className="absolute w-full bg-black p-1 overflow-y-auto min-h-auto max-h-40 top-14 rounded-md border border-slate-400 z-10">
			{years.map((year: string, index: number) => {
				return (
					<div
						className="flex hover:bg-zinc-800 hover:cursor-pointer"
						onClick={() => {
							setSelectedYear(year);
							handleYearSelection(year);
						}}
					>
						<div key={index} className={`p-2 ${year === "" && "h-9"}`}>
							{year}
						</div>
						{year === selectedYear && (
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
