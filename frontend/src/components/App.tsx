import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import Explore from "./pages/feed/Explore";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
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
