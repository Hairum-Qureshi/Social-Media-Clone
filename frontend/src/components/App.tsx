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
import { SocketProvider } from "../contexts/SocketIOContext";
import PostDetails from "./post/PostDetails";
import Requests from "./pages/navigation/messages/Requests";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/sign-in"
					element={
						<SocketProvider>
							<SignIn />
						</SocketProvider>
					}
				/>
				<Route path="/sign-up" element={<SignUp />} />
				<Route
					path="/"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Feed />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/explore"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Explore />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/notifications"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Notifications />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages/compose"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages/conversation/:conversationID/:userIDs"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages/compose/group"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Messages />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/messages/requests"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Requests />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/bookmarks"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Bookmarks />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/:username"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<Profile />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route
					path="/post/:postID"
					element={
						<AuthProvider>
							<SocketProvider>
								<ProtectedRoutesGuard>
									<PostDetails />
								</ProtectedRoutesGuard>
							</SocketProvider>
						</AuthProvider>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
