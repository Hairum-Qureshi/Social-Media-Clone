import { Navigate } from "react-router-dom";
import SideNavbar from "./pages/navigation/SideNavbar";
import SideSuggestions from "./pages/feed/suggestions/SideSuggestions";
import useAuthContext from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import SignIn from "./pages/authentication/SignIn";

export default function ProtectedRoutesGuard({
	children
}: React.PropsWithChildren) {
	const { userData } = useAuthContext()!;
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (userData !== null) {
			setIsLoading(false);
		}
	}, [userData, isLoading]);

	if (isLoading) return <SignIn />;

	return userData ? (
		<div className="w-full h-screen flex">
			<SideNavbar />
			<div className="flex-1 flex justify-center">{children}</div>
			{(!window.location.href.includes("/messages") &&
				!window.location.href.includes("/messages/requests")) && (
				<SideSuggestions />
			)}
		</div>
	) : (
		<Navigate to="/sign-in" />
	);
}
