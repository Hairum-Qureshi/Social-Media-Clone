import { SideSuggestionsComponentProps } from "../../../../interfaces";
import FollowersSuggestions from "./FollowersSuggestions";

export default function SideSuggestions({
	showFollowerSuggestions
}: SideSuggestionsComponentProps) {
	return (
		<div className="lg:w-1/4 w-32 bg-black border-l-2 border-l-gray-700 overflow-hidden text-white">
			{showFollowerSuggestions && <FollowersSuggestions />}
		</div>
	);
}
