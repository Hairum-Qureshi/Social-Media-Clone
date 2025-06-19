import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditorTypes } from "../../../../../../interfaces";
import TipTapEditor from "../editor/TipTapEditor";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import MonthsDropDown from "./dropdowns/MonthsDropDown";
import YearsDropDown from "./dropdowns/YearsDropDown";
import useProfile from "../../../../../../hooks/useProfile";

// TODO - add disable effect if the user checks 'currently works here'
// ! issue - animated placeholder hides text in input

interface WorkHistoryFormProps {
	hideWorkHistoryForm: () => void;
}

export default function WorkHistoryForm({
	hideWorkHistoryForm
}: WorkHistoryFormProps) {
	const [isCurrentlyWorkingHere, setIsCurrentlyWorkingHere] = useState(false);
	const [jobTitle, setJobTitle] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [location, setLocation] = useState("");
	const [experience, setExperience] = useState("");
	const [showStartMonths, setShowStartMonths] = useState(false);
	const [showEndMonths, setShowEndMonths] = useState(false);
	const [chosenStartMonth, setChosenStartMonth] = useState("");
	const [chosenEndMonth, setChosenEndMonth] = useState("");
	const [selectedStartYear, setSelectedStartYear] = useState<string>(
		new Date().getFullYear().toString()
	);
	const [selectedEndYear, setSelectedEndYear] = useState<string>(
		new Date().getFullYear().toString()
	);
	const [showSelectedStartYear, setShowSelectedStartYear] = useState(false);
	const [showSelectedEndYear, setShowSelectedEndYear] = useState(false);

	function handleMonthSelection(month: string) {
		if (showStartMonths) {
			setChosenStartMonth(month);
			setShowStartMonths(false);
		}
		if (showEndMonths) {
			setChosenEndMonth(month);
			setShowEndMonths(false);
		}
	}

	function handleYearSelection(year: string) {
		if (showSelectedStartYear) {
			setSelectedStartYear(year);
			setShowSelectedStartYear(false);
		}
		if (showSelectedEndYear) {
			setSelectedEndYear(year);
			setShowSelectedEndYear(false);
		}
	}

	function getEditorContent(content: string) {
		setExperience(content);
	}

	const { addExtendedBioWorkExperience } = useProfile();

	return (
		<div className="mt-3 border border-slate-700 p-2 rounded-md bg-zinc-900">
			<h3 className="text-white text-lg font-semibold">Add Experience</h3>
			<div className="relative mt-6 w-full">
				<input
					type="text"
					id="jobTitle"
					placeholder="Job Title"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white placeholder-transparent"
					value={jobTitle}
					onChange={e => setJobTitle(e.target.value)}
				/>
				<label
					htmlFor="jobTitle"
					className="absolute left-2 top-2 text-slate-400 text-sm bg-zinc-900 px-1 transition-all duration-200 
               peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
               peer-placeholder-shown:text-slate-500 
               peer-focus:top-[-0.6rem] peer-focus:text-sm peer-focus:text-slate-500"
				>
					Job Title
				</label>
			</div>
			<div className="relative mt-6 w-full">
				<input
					type="text"
					id="company"
					placeholder="Company"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white placeholder-transparent"
					value={companyName}
					onChange={e => setCompanyName(e.target.value)}
				/>
				<label
					htmlFor="company"
					className="absolute left-2 top-2 text-slate-400 text-sm bg-zinc-900 px-1 transition-all duration-200 
               peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
               peer-placeholder-shown:text-slate-500 
               peer-focus:top-[-0.6rem] peer-focus:text-sm peer-focus:text-slate-500"
				>
					Company
				</label>
			</div>
			<div className="relative my-6 w-full">
				<input
					type="text"
					id="location"
					placeholder="Location"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white placeholder-transparent"
					value={location}
					onChange={e => setLocation(e.target.value)}
				/>
				<label
					htmlFor="location"
					className="absolute left-2 top-2 text-slate-400 text-sm bg-zinc-900 px-1 transition-all duration-200 
               peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
               peer-placeholder-shown:text-slate-500 
               peer-focus:top-[-0.6rem] peer-focus:text-sm peer-focus:text-slate-500"
				>
					Location
				</label>
			</div>
			<div className="flex items-center">
				<input
					type="checkbox"
					placeholder="Job Title"
					className="border border-slate-500 w-3.5 h-3.5"
					onChange={() => setIsCurrentlyWorkingHere(!isCurrentlyWorkingHere)}
				/>
				<label htmlFor="" className="ml-2">
					Currently work here
				</label>
			</div>
			<div>
				<div className="w-full mt-4">
					<h3 className="font-semibold text-lg">Start Date</h3>
					<div className="flex mt-3">
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className="w-full border border-slate-500 rounded-md flex items-center"
								onClick={() => {
									setShowStartMonths(!showStartMonths);
									if (showEndMonths) setShowEndMonths(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Month</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{chosenStartMonth}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showStartMonths && (
								<MonthsDropDown handleMonthSelection={handleMonthSelection} />
							)}
						</div>
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className="w-full border border-slate-500 rounded-md flex items-center"
								onClick={() => {
									setShowSelectedStartYear(!showSelectedStartYear);
									if (showSelectedEndYear) setShowSelectedEndYear(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Year</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{selectedStartYear}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showSelectedStartYear && (
								<YearsDropDown handleYearSelection={handleYearSelection} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="w-full my-4">
					<h3 className="font-semibold text-lg">End Date</h3>
					<div className="flex mt-3">
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className={`w-full border border-slate-500 rounded-md flex items-center ${
									isCurrentlyWorkingHere && "bg-gray-900"
								}`}
								onClick={() => {
									setShowEndMonths(!showEndMonths);
									if (showStartMonths && !isCurrentlyWorkingHere)
										setShowStartMonths(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Month</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{chosenEndMonth}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showEndMonths && !isCurrentlyWorkingHere && (
								<MonthsDropDown handleMonthSelection={handleMonthSelection} />
							)}
						</div>
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className={`w-full border border-slate-500 rounded-md flex items-center ${
									isCurrentlyWorkingHere && "bg-gray-900"
								}`}
								onClick={() => {
									setShowSelectedEndYear(!showSelectedEndYear);
									if (showSelectedStartYear && !isCurrentlyWorkingHere)
										setShowSelectedStartYear(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Year</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{selectedEndYear}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showSelectedEndYear && !isCurrentlyWorkingHere && (
								<YearsDropDown handleYearSelection={handleYearSelection} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				<h3 className="font-semibold text-lg">Experience</h3>
				<div className="border border-slate-500 mt-2 rounded-md max-w-full">
					<TipTapEditor
						getEditorContent={getEditorContent}
						editorFor={EditorTypes.WORK_HISTORY}
						showBlockQuoteButton={false}
						showEmojiButton={false}
						showLinkButton={false}
						showTextSizesSelector={false}
					/>
				</div>
			</div>
			<div className="flex mt-2">
				<button
					className="p-1 rounded-md bg-sky-500 w-28 ml-auto"
					onClick={() => {
						addExtendedBioWorkExperience(
							isCurrentlyWorkingHere,
							jobTitle,
							companyName,
							location,
							`${chosenStartMonth} ${selectedStartYear}`,
							`${chosenEndMonth} ${selectedEndYear}`,
							experience
						);
						hideWorkHistoryForm();
					}}
				>
					Add
				</button>
			</div>
		</div>
	);
}
