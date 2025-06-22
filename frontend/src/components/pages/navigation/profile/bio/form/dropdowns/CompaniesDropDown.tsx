import { useEffect, useState } from "react";

interface CompaniesDropDownProps {
	company: string;
    setCompany: (company:string, companyLogo:string) => void;
}

interface Logo {
	domain: string;
	logo_url: string;
	name: string;
}

export default function CompaniesDropDown({ company, setCompany }: CompaniesDropDownProps) {
	const [logos, setLogos] = useState<Logo[]>([]);

	async function getLogos() {
		const res = await fetch(`https://api.logo.dev/search?q=${company}`, {
			headers: { Authorization: `Bearer: sk_KcbCNzr4Q_m_Ma8GfBnFXA` }
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				return data;
			});

		setLogos(res);
	}

	useEffect(() => {
		getLogos();
	}, [company]);

	return (
		<div className="absolute w-full bg-black p-1 overflow-y-auto min-h-auto max-h-40 top-10 rounded-md border border-slate-400 z-10">
			{logos.length > 0 ? (
				logos.map((logo: Logo) => {
					return (
						<div className="flex items-center hover:cursor-pointer hover:bg-slate-800" onClick = {() => setCompany(logo.name, logo.logo_url)}>
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
