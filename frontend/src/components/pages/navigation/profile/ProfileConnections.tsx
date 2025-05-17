import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useProfile from "../../../../hooks/useProfile";

export default function ProfileConnections() {
	const location = useLocation();
	const currentPage = location.pathname.split("/").pop();

	const [followingPage, setFollowingPage] = useState(
		currentPage === "following"
	);
	const [followersPage, setFollowersPage] = useState(
		currentPage === "followers"
	);
	const [verifiedFollowersPage, setVerifiedFollowersPage] = useState(
		currentPage === "verified_followers"
	);

	const username = location.pathname.split("/")[1];
	const navigate = useNavigate();

	useEffect(() => {
		setFollowingPage(currentPage === "following");
		setFollowersPage(currentPage === "followers");
		setVerifiedFollowersPage(currentPage === "verified_followers");
	}, [currentPage]);

	const { profileData } = useProfile();

	console.log(profileData);

	return (
		<div className="bg-black w-full text-white min-h-screen overflow-auto">
			<div className="bg-black h-screen">
				<div className="w-full p-2 flex items-center">
					<div className="text-xl ml-5">
						<FontAwesomeIcon icon={faArrowLeft} />
					</div>
					<div>
						<h2 className="font-bold ml-5 text-xl">{profileData?.fullName}</h2>
						<div className="ml-5 text-gray-500">@{username}</div>
					</div>
				</div>
				<div className="border-b-2 border-gray-500 h-14 flex text-center hover:cursor-pointer font-bold w-full">
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							verifiedFollowersPage && "border-b-2 border-sky-500"
						}`}
						onClick={() => navigate(`/${username}/verified_followers`)}
					>
						Verified Followers
					</div>
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							followersPage && "border-b-2 border-sky-500"
						}`}
						onClick={() => navigate(`/${username}/followers`)}
					>
						Followers
					</div>
					<div
						className={`w-1/2 flex items-center justify-center hover:bg-gray-900 ${
							followingPage && "border-b-2 border-sky-500"
						}`}
						onClick={() => navigate(`/${username}/following`)}
					>
						Following
					</div>
				</div>
			</div>
		</div>
	);
}
