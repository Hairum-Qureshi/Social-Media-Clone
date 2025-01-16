import UserCard from "../UserCard";

export default function FollowersSuggestions() {
	return (
		<div className="rounded-md bg-gray-800 my-5 mx-3 p-2 hidden lg:block">
			<h1 className="font-bold">Who to follow</h1>
			<UserCard />
			<UserCard />
			<UserCard />
			<UserCard />
			<UserCard />
		</div>
	);
}
