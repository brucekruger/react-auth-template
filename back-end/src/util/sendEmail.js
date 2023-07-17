const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = ({
	to, from, subject, text, html,
}) => {
	return sendgrid.send({ to, from, subject, text, html });
}

module.exports = sendEmail;