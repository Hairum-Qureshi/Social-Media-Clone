import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import useProfile from "../../../../../hooks/useProfile";
import { useLocation, useNavigate } from "react-router-dom";
import AboutBio from "./AboutBio";
import WorkHistory from "./WorkHistory";

export default function UserBio() {
	const { userData } = useAuthContext()!;
	const { extendedBio } = useProfile();

	// TODO - add a loading animation when the save button is pressed
	// TODO - make it so that you can click anywhere in the editor and be able to type instead of just the beginning
	// TODO - need to add elapsed time from start date to end date
	// TODO - need to prevent empty inputs
	// TODO - need to add 'read more' to work history divs
	// ! formatDateRange() function does not work
	// ! The pencil icon for the extended bio does not stay horizontally aligned

	const location = useLocation();
	const [pathname, setPathname] = useState(location.pathname.split("/"));
	const pathnameLength = location.pathname.split("/").length;

	useEffect(() => {
		setPathname(location.pathname.split("/"));
	}, [location.pathname]);

	const navigate = useNavigate();
	const isAnotherUserProfile: boolean = location.pathname.includes(
		"/settings/bio"
	)
		? false
		: pathnameLength === 3 && pathname[1] !== userData?.username;

	// TODO - need to add a character limit for the extended bio
	// ! Fix issue where the current user is unable to update their extended bio (clicking on the div won't work)

	return (
		<div className="bg-black text-white min-h-screen overflow-auto mx-auto w-full max-w-screen-xl">
			<div className="w-full p-2 flex items-center">
				<div
					className="text-xl ml-5 hover:cursor-pointer"
					onClick={() => navigate(-1)}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div className="ml-5 flex items-center">
					<img
						src={
							isAnotherUserProfile
								? extendedBio?.userData?.profilePicture
								: userData?.profilePicture
						}
						alt="User profile picture"
						className="w-10 h-10 rounded-full object-cover"
					/>
					<div className="flex flex-col ml-3 text-base">
						<span className="ml-2 font-semibold">
							{isAnotherUserProfile && extendedBio
								? extendedBio?.userData?.fullName
								: userData?.fullName}
						</span>
						<span className="ml-2 text-slate-500">
							@
							{isAnotherUserProfile && extendedBio
								? extendedBio?.userData?.username
								: userData?.username}
						</span>
					</div>
				</div>
				{pathname[1] === userData?.username && pathname[1] !== "settings" && (
					<div className="ml-auto border border-white rounded-lg p-0.5 w-16 text-center">
						<button onClick={() => (window.location.href = "/settings/bio")}>
							Edit
						</button>
					</div>
				)}
			</div>
			{isAnotherUserProfile &&
			!extendedBio.extendedBio &&
			extendedBio.workExperience.length === 0 ? (
				<div className="p-3 my-28 mx-20">
					<h1 className="font-bold text-4xl">
						This user currently does not have an expanded bio
					</h1>
					<p className="text-base text-zinc-500 mt-3">
						Try searching for another.
					</p>
				</div>
			) : (
				<>
					<AboutBio isAnotherUserProfile={isAnotherUserProfile} />
					{isAnotherUserProfile
						? extendedBio?.workExperience.length !== 0 && (
								<WorkHistory isAnotherUserProfile={true} />
						  )
						: !isAnotherUserProfile && (
								<WorkHistory isAnotherUserProfile={false} />
						  )}
				</>
			)}
		</div>
	);
}
