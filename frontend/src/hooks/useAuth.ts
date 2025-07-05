import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import useSocketContext from "../contexts/SocketIOContext";
import { useNavigate } from "react-router-dom";

interface AuthTools {
	signUp: (
		event: React.FormEvent,
		username: string,
		fullName: string,
		email: string,
		password: string
	) => void;
	signUpIsPending: boolean;
	signIn: (event: React.FormEvent, username: string, password: string) => void;
	signInIsPending: boolean;
	isSignInError: boolean;
	isSignUpError: boolean;
	signOut: () => void;
}

interface FormData {
	username: string;
	fullName?: string;
	email?: string;
	password: string;
}

// TODO - if the user leaves the form empty and tries signing in or up, the toaster notif isn't red because it's not detected as an error

export default function useAuth(): AuthTools {
	const [errorData, setErrorData] = useState({
		message: "",
		for: ""
	});

	const { connectSocket, disconnectSocket } = useSocketContext()!;
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		mutate: signUpMutate,
		isError: isSignUpError,
		isPending: signUpIsPending,
		error: signUpError
	} = useMutation({
		mutationFn: async (data: FormData) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-up`,
					data,
					{
						withCredentials: true
					}
				);

				navigate(`/${response.data.userData.username}`);
				return response;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}
			}
		}
	});

	function signUp(
		event: React.FormEvent,
		username: string,
		fullName: string,
		email: string,
		password: string
	) {
		event.preventDefault();

		if (!username || !fullName || !email || !password) {
			toast("Please fill in all fields", {
				autoClose: 700,
				hideProgressBar: true
			});
		} else {
			const data = {
				username,
				fullName,
				email,
				password
			};

			signUpMutate(data);
		}
	}

	const {
		mutate: signInMutate,
		isError: isSignInError,
		isPending: signInIsPending,
		error: signInError
	} = useMutation({
		mutationFn: async (data: FormData) => {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-in`,
					data,
					{
						withCredentials: true
					}
				);

				navigate(`/${response.data.userData.username}`);
				connectSocket();
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user"]
			});
		}
	});

	function signIn(event: React.FormEvent, username: string, password: string) {
		event.preventDefault();

		if (!username || !password) {
			toast("Please fill in all fields", {
				autoClose: 700,
				hideProgressBar: true
			});
		} else {
			const data = {
				username,
				password
			};
			signInMutate(data);
		}
	}

	const { mutate: signOutMutate } = useMutation({
		mutationFn: async () => {
			try {
				await axios.post(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/sign-out`,
					{},
					{
						withCredentials: true
					}
				);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 600,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}
			}
		},
		onSuccess: () => {
			disconnectSocket();
		}
	});

	function signOut() {
		signOutMutate();
	}

	return {
		signUp,
		signUpIsPending,
		signIn,
		signInIsPending,
		isSignInError,
		isSignUpError,
		signOut
	};
}
