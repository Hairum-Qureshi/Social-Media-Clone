import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

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

		// axios
		// 	.post(
		// 		"http://localhost:2000/api/auth/sign-up",
		// 		{
		// 			username: username.toLowerCase(),
		// 			fullName,
		// 			email,
		// 			password
		// 		},
		// 		{
		// 			withCredentials: true
		// 		}
		// 	)
		// 	.then(() => {
		//         // console.log(response.data);
		// 		// TODO - save user data
		// 		// window.location.href = "/";
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});

		// let error = {
		// 	message: "",
		// 	for: ""
		// };

		// if (!username || !fullName || !email || !password) {
		// 	// error = {
		// 	// 	message: "Please fill in all fields",
		// 	// 	for: "all"
		// 	// };

		// } else {
		// 	const usernameRegex: RegExp =
		// 		/^[a-z](?:_?[a-z0-9]|(?:\.[a-z0-9])){5,20}$/;
		// 	if (!usernameRegex.test(username)) {
		// 		// error = {
		// 		// 	message:
		// 		// 		"Username must be between 6 and 20 characters, can only contain letters, numbers, periods, and underscores",
		// 		// 	for: "username"
		// 		// };
		// 	}

		// 	const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]/;
		// 	if (!emailRegex.test(email)) {
		// 		// error = {
		// 		// 	message: "Invalid email",
		// 		// 	for: "email"
		// 		// };
		// 	}

		// 	if (password.length < 6) {
		// 		// error = {
		// 		// 	message: "Password must be at least 6 characters long",
		// 		// 	for: "password"
		// 		// };
		// 	}

		// 	setErrorMessage({
		// 		message: "",
		// 		for: ""
		// 	});

		// 	axios
		// 		.post("http://localhost:2000/api/auth/sign-up", {
		// 			username,
		// 			fullName,
		// 			email,
		// 			password
		// 		})
		// 		.then(response => {
		// 			console.log(response.data);
		// 		})
		// 		.catch(error => {
		// 			console.log(error);
		// 		});

		// }

		// setErrorMessage(error);
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

				window.location.href = `/${response.data.username}`;
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

				console.log("ran");
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
