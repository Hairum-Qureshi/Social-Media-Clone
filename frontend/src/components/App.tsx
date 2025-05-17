import { BrowserRouter, Route, Routes } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import SignIn from "./pages/authentication/SignIn";
import SignUp from "./pages/authentication/SignUp";
import Explore from "./pages/navigation/Explore";
import Notifications from "./pages/navigation/notification/Notifications";
import Messages from "./pages/navigation/messages/Messages";
import Bookmarks from "./pages/navigation/Bookmarks";
import Profile from "./pages/navigation/profile/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoutesGuard from "./ProtectedRoutesGuard";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketIOContext";
import PostDetails from "./post/PostDetails";
import Requests from "./pages/navigation/messages/Requests";
import ProfileConnections from "./pages/navigation/profile/ProfileConnections";

// TODO - you may need to move AuthProvider so it's not wrapped around *all* the routes, but if it causes no harm, leave it

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<SocketProvider>
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
							path="/messages/compose"
							element={
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							}
						/>
						<Route
							path="/messages/conversation/:conversationID/:userIDs"
							element={
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							}
						/>
						<Route
							path="/messages/compose/group"
							element={
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							}
						/>
						<Route
							path="/messages/requests"
							element={
								<ProtectedRoutesGuard>
									<Requests />
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
						<Route
							path="/:username/followers"
							element={
								<ProtectedRoutesGuard>
									<ProfileConnections />
								</ProtectedRoutesGuard>
							}
						/>
						<Route
							path="/:username/following"
							element={
								<ProtectedRoutesGuard>
									<ProfileConnections />
								</ProtectedRoutesGuard>
							}
						/>
						<Route
							path="/:username/verified_followers"
							element={
								<ProtectedRoutesGuard>
									<ProfileConnections />
								</ProtectedRoutesGuard>
							}
						/>
						<Route
							path="/post/:postID"
							element={
								<ProtectedRoutesGuard>
									<PostDetails />
								</ProtectedRoutesGuard>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</SocketProvider>
			</AuthProvider>
		</BrowserRouter>
	);
}
