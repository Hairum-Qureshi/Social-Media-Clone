import { Navigate, useLocation } from "react-router-dom";
import SideNavbar from "./pages/navigation/SideNavbar";
import SideSuggestions from "./pages/feed/suggestions/SideSuggestions";
import useAuthContext from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import SignIn from "./pages/authentication/SignIn";
import useProfile from "../hooks/useProfile";
import usePosts from "../hooks/usePosts";

// TODO - when you open a profile page that has no posts, it shows the SideSuggestions component appear on the side for a brief moment

export default function ProtectedRoutesGuard({
	children
}: React.PropsWithChildren) {
	const { userData } = useAuthContext()!;
	const [isLoading, setIsLoading] = useState(true);
	const { profileData } = useProfile();
	const { postData } = usePosts();
	const location = useLocation();

	useEffect(() => {
		if (userData !== null) {
			setIsLoading(false);
		}
	}, [userData, isLoading]);

	if (isLoading) return <SignIn />;

	const isMessagesPage =
		location.pathname.includes("/messages") ||
		location.pathname.includes("/messages/requests");

	const isDetailedPhotoPostGallery = location.pathname.includes("/photo");

	const isProfilePage = location.pathname === `/${profileData?.username}`;
	const showSideSuggestions =
		isProfilePage && postData?.length === 0 ? false : true;

	return userData ? (
		<div className="w-full h-screen flex">
			{!isDetailedPhotoPostGallery && <SideNavbar />}
			<div className="flex-1 flex justify-center">{children}</div>
			{!isMessagesPage && !isDetailedPhotoPostGallery && (
				<SideSuggestions showFollowerSuggestions={showSideSuggestions} />
			)}
		</div>
	) : (
		<Navigate to="/sign-in" />
	);
}
