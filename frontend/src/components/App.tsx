import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import Explore from "./pages/navigation/Explore";
import Notifications from "./pages/navigation/notification/Notifications";
import Messages from "./pages/navigation/messages/Messages";
import Bookmarks from "./pages/navigation/Bookmarks";
import Profile from "./pages/navigation/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoutesGuard from "./ProtectedRoutesGuard";
import { AuthProvider } from "../contexts/AuthContext";
import PostDetails from "./post/PostDetails";
import Requests from "./pages/navigation/messages/Requests";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route
					path="/"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Feed />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/explore"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Explore />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/notifications"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Notifications />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Messages />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages/compose"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Messages />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages/requests"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Requests />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/bookmarks"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Bookmarks />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/:username"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<Profile />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route
					path="/post/:postID"
					element={
						<AuthProvider>
							<ProtectedRoutesGuard>
								<PostDetails />
							</ProtectedRoutesGuard>
						</AuthProvider>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
