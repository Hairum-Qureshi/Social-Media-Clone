import { Navigate } from "react-router-dom";
import SideNavbar from "./pages/feed/SideNavbar";
import SideSuggestions from "./pages/feed/SideSuggestions";

export default function ProtectedRoutesGuard({
	children
}: React.PropsWithChildren) {
	const isLoggedIn = true;
	return isLoggedIn ? (
		<div className="w-full h-screen flex">
			<SideNavbar />
			<div className="flex-1 flex justify-center">
				{children}
			</div>
			<SideSuggestions />
		</div>
	) : (
		<Navigate to="/sign-in" />
	);
}
