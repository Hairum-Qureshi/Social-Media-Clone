import useFeed from "../../../../hooks/useFeed";
import { UserData } from "../../../../interfaces";
import UserCard from "../UserCard";

export default function FollowersSuggestions() {
	const { getFollowReccs } = useFeed();

	return (
		<div className="rounded-md bg-zinc-900 my-5 mx-3 p-2 hidden lg:block">
			<h1 className="font-bold text-xl m-3">Who to follow</h1>
			{getFollowReccs?.length > 0 ? (
				getFollowReccs?.map((user: UserData) => {
					return (
						<UserCard
							showFollowButton={true}
							isFollowing={false}
							showFollowStatus={false}
							userData={user}
						/>
					);
				})
			) : (
				<h3 className="text-center font-semibold">
					There are currently no users to follow
				</h3>
			)}
		</div>
	);
}
