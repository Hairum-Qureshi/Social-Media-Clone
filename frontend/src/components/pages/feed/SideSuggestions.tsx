import UserCard from "./UserCard";

export default function SideSuggestions() {
	return (
		<div className="lg:w-1/4 w-32 bg-black border-l-2 border-l-gray-700 overflow-hidden text-white">
			<div className="rounded-md bg-gray-800 my-5 mx-3 p-2 hidden lg:block">
				<h1 className="font-bold">Who to follow</h1>
				<UserCard />
				<UserCard />
				<UserCard />
				<UserCard />
				<UserCard />
			</div>
		</div>
	);
}
