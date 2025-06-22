import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	EditorTypes,
	WorkHistoryFormProps
} from "../../../../../../interfaces";
import TipTapEditor from "../editor/TipTapEditor";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import MonthsDropDown from "./dropdowns/MonthsDropDown";
import YearsDropDown from "./dropdowns/YearsDropDown";
import useProfile from "../../../../../../hooks/useProfile";
import CompaniesDropDown from "./dropdowns/CompaniesDropDown";

// ! issue - animated placeholder hides text in input

export default function WorkHistoryForm({
	hideWorkHistoryForm,
	workHistoryToEdit
}: WorkHistoryFormProps) {
	const [isCurrentlyWorkingHere, setIsCurrentlyWorkingHere] = useState(
		workHistoryToEdit ? workHistoryToEdit.currentlyWorkThere : false
	);
	const [jobTitle, setJobTitle] = useState(
		workHistoryToEdit ? workHistoryToEdit.jobTitle : ""
	);
	const [companyName, setCompanyName] = useState(
		workHistoryToEdit ? workHistoryToEdit.company : ""
	);
	const [location, setLocation] = useState(
		workHistoryToEdit ? workHistoryToEdit.location : ""
	);
	const [experience, setExperience] = useState(
		workHistoryToEdit ? workHistoryToEdit.description : ""
	);
	const [showStartMonths, setShowStartMonths] = useState(false);
	const [showEndMonths, setShowEndMonths] = useState(false);
	const [chosenStartMonth, setChosenStartMonth] = useState(
		workHistoryToEdit ? workHistoryToEdit.startDate.split(" ")[0] : ""
	);
	const [chosenEndMonth, setChosenEndMonth] = useState(
		workHistoryToEdit ? workHistoryToEdit.endDate.split(" ")[0] : ""
	);
	const [selectedStartYear, setSelectedStartYear] = useState<string>(
		workHistoryToEdit
			? workHistoryToEdit.startDate.split(" ").pop()!
			: new Date().getFullYear().toString()
	);
	const [selectedEndYear, setSelectedEndYear] = useState<string>(
		workHistoryToEdit
			? workHistoryToEdit.endDate.split(" ").pop()!
			: new Date().getFullYear().toString()
	);
	const [showSelectedStartYear, setShowSelectedStartYear] = useState(false);
	const [showSelectedEndYear, setShowSelectedEndYear] = useState(false);
	const [companyLogo, setCompanyLogo] = useState("");
	const [showCompaniesDropDown, setShowCompaniesDropDown] = useState(false);

	function handleMonthSelection(month: string) {
		if (showStartMonths) {
			setChosenStartMonth(
				workHistoryToEdit ? workHistoryToEdit.startDate.split(" ")[0] : month
			);
			setShowStartMonths(false);
		}
		if (showEndMonths) {
			setChosenEndMonth(
				workHistoryToEdit ? workHistoryToEdit.endDate.split(" ")[0] : month
			);
			setShowEndMonths(false);
		}
	}

	function handleYearSelection(year: string) {
		if (showSelectedStartYear) {
			setSelectedStartYear(
				workHistoryToEdit ? workHistoryToEdit.startDate.split(" ").pop()! : year
			);
			setShowSelectedStartYear(false);
		}
		if (showSelectedEndYear) {
			setSelectedEndYear(
				workHistoryToEdit ? workHistoryToEdit.endDate.split(" ").pop()! : year
			);
			setShowSelectedEndYear(false);
		}
	}

	function getEditorContent(content: string) {
		setExperience(content);
	}

	function setCompany(company: string, companyLogo: string) {
		setCompanyName(company);
		setCompanyLogo(companyLogo);
		setShowCompaniesDropDown(false);
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
					value={workHistoryToEdit ? workHistoryToEdit.jobTitle : jobTitle}
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
					value={workHistoryToEdit ? workHistoryToEdit.company : companyName}
					onChange={e => setCompanyName(e.target.value)}
					onKeyDown={() => setShowCompaniesDropDown(true)}
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
				{companyName && showCompaniesDropDown && (
					<CompaniesDropDown company={companyName} setCompany={setCompany} />
				)}
			</div>
			<div className="relative my-6 w-full">
				<input
					type="text"
					id="location"
					placeholder="Location"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white placeholder-transparent"
					value={workHistoryToEdit ? workHistoryToEdit.location : location}
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
						workExperienceDescription={workHistoryToEdit?.description}
					/>
				</div>
			</div>
			<div className="flex mt-2">
				{workHistoryToEdit ? (
					<button
						className="p-1 rounded-md bg-sky-500 w-28 ml-auto"
						onClick={() => {
							// addExtendedBioWorkExperience(
							// 	isCurrentlyWorkingHere,
							// 	jobTitle,
							// 	companyName,
							// 	location,
							// 	`${chosenStartMonth} ${selectedStartYear}`,
							// 	`${chosenEndMonth} ${selectedEndYear}`,
							// 	experience
							// );
							hideWorkHistoryForm();
						}}
					>
						Update
					</button>
				) : (
					<button
						className="p-1 rounded-md bg-sky-500 w-28 ml-auto"
						onClick={() => {
							addExtendedBioWorkExperience(
								isCurrentlyWorkingHere,
								jobTitle,
								companyName,
								companyLogo,
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
				)}
			</div>
		</div>
	);
}
