import nodemailer from "nodemailer";

function callEmailAuth(): nodemailer.Transporter {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.APP_PASS
		}
	});

	return transporter;
}

export async function sendEmailNotification(fromEmail:string, toEmail:string, toName:string, message:string, fromUsername:string, subject?:string) {
	try {
		const transporter = callEmailAuth();
		await transporter.sendMail({
			from: fromEmail,
			to: `${toName} <${toEmail}>`,
			subject: subject ? subject : `@${fromUsername} sent you a DM request on X-Clone!`,
			text: message 
		});
	} catch (error) {
		"<nodemailer.ts> sendEmail function error".yellow,
			(error as Error).toString().red.bold;
	}
}
