import { Navigate, useLocation } from "react-router-dom";
import SideNavbar from "./pages/navigation/SideNavbar";
import SideSuggestions from "./pages/feed/suggestions/SideSuggestions";
import useAuthContext from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import SignIn from "./pages/authentication/SignIn";
import useProfile from "../hooks/useProfile";
import usePosts from "../hooks/usePosts";

export default function ProtectedRoutesGuard({
	children
}: React.PropsWithChildren) {
	const { userData } = useAuthContext()!;
	const [isLoading, setIsLoading] = useState(true);
	const { profileData } = useProfile();
	const { currentUserPostData } = usePosts();
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

	const isProfilePage = location.pathname === `/${profileData?.username}`;
	const showSideSuggestions =
		isProfilePage && currentUserPostData.length === 0 ? false : true;

	return userData ? (
		<div className="w-full h-screen flex">
			<SideNavbar />
			<div className="flex-1 flex justify-center">{children}</div>
			{!isMessagesPage && !isProfilePage ? (
				<SideSuggestions showFollowerSuggestions={false} />
			) : (
				<SideSuggestions showFollowerSuggestions={showSideSuggestions} />
			)}
		</div>
	) : (
		<Navigate to="/sign-in" />
	);
}
