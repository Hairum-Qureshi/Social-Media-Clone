import UserCard from "../UserCard";

export default function FollowersSuggestions() {
	return (
		<div className="rounded-md bg-zinc-900 my-5 mx-3 p-2 hidden lg:block">
			<h1 className="font-bold text-xl m-3">Who to follow</h1>
			<UserCard />
			<UserCard />
			<UserCard />
			<UserCard />
			<UserCard />
		</div>
	);
}
