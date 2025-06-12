/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				artegra: ["artegra-sans-extra-bold", "sans-serif"]
			},
			typography: {
				DEFAULT: {
					css: {
						h1: {
							fontFamily: '"artegra-sans-extra-bold", sans-serif',
							marginBottom: "-20px"
						}
					}
				}
			}
		}
	},
	plugins: [require("@tailwindcss/typography")]
};
