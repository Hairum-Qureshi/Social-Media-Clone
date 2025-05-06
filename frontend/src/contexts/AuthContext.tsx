import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { ContextProps, ContextData, UserData } from "../interfaces";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext<ContextData | null>(null);

export const AuthProvider = ({ children }: ContextProps) => {
	const [userData, setUserData] = useState<UserData | null>(null);

	const { data } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/current-user`,
					{
						withCredentials: true
					}
				);
				return response.data;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast(error.response?.data.error, {
						autoClose: 500,
						hideProgressBar: true
					});
				} else {
					toast("An unknown error occurred", {
						autoClose: 600,
						hideProgressBar: true
					});
				}

				return null;
			}
		}
	});

	useEffect(() => {
		if (data) setUserData(data);
	}, [data]);

	const value: ContextData = {
		userData
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
	return useContext(AuthContext);
};

export default useAuthContext;
