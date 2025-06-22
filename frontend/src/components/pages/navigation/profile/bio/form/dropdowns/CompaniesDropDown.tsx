import { useEffect, useState } from "react";
import axios from "axios";

interface CompaniesDropDownProps {
	company: string;
	setCompany: (company: string, companyLogo: string) => void;
}

interface Logo {
	domain: string;
	logo_url: string;
	name: string;
}

export default function CompaniesDropDown({
	company,
	setCompany
}: CompaniesDropDownProps) {
	const [logos, setLogos] = useState<Logo[]>([]);

	async function getLogos() {
		try {
			const res = await axios.get(`https://api.logo.dev/search?q=${company}`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_LOGO_DEV_SECRET_KEY}`
				}
			});

			setLogos(res.data);
		} catch (error) {
			console.error("Error fetching logos:", error);
		}
	}

	useEffect(() => {
		getLogos();
	}, [company]);

	return (
		<div className="absolute w-full bg-black p-1 overflow-y-auto min-h-auto max-h-40 top-10 rounded-md border border-slate-400 z-10">
			{logos.length > 0 ? (
				logos.map((logo: Logo) => {
					return (
						<div
							className="flex items-center hover:cursor-pointer hover:bg-slate-800"
							onClick={() => setCompany(logo.name, logo.logo_url)}
						>
							<div className="w-8 h-8 m-1">
								<img
									src={logo.logo_url}
									alt="Company logo"
									className="w-8 h-8 object-cover rounded-sm"
								/>
							</div>
							<div>{logo.name}</div>
						</div>
					);
				})
			) : (
				<p>Could not find any companies with the name "{company}"</p>
			)}
		</div>
	);
}
