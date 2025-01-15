import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import Explore from "./pages/navigation/Explore";
import Notifications from "./pages/navigation/Notifications";
import Messages from "./pages/navigation/Messages";
import Bookmarks from "./pages/navigation/Bookmarks";
import Profile from "./pages/navigation/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoutesGuard from "./ProtectedRoutesGuard";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route
					path="/"
					element={
						<ProtectedRoutesGuard>
							<Feed />
						</ProtectedRoutesGuard>
					}
				/>
				<Route
					path="/explore"
					element={
						<ProtectedRoutesGuard>
							<Explore />
						</ProtectedRoutesGuard>
					}
				/>
				<Route
					path="/notifications"
					element={
						<ProtectedRoutesGuard>
							<Notifications />
						</ProtectedRoutesGuard>
					}
				/>
				<Route
					path="/messages"
					element={
						<ProtectedRoutesGuard>
							<Messages />
						</ProtectedRoutesGuard>
					}
				/>
				<Route
					path="/bookmarks"
					element={
						<ProtectedRoutesGuard>
							<Bookmarks />
						</ProtectedRoutesGuard>
					}
				/>
				<Route
					path="/:username"
					element={
						<ProtectedRoutesGuard>
							<Profile />
						</ProtectedRoutesGuard>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
