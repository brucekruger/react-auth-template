const { v4: uuid } = require('uuid');
const sendEmail = require('../util/sendEmail');
const { getDbConnection } = require('../db');

const forgotPasswordRoute = {
	path: '/api/forgot-password/:email',
	method: 'put',
	handler: async (req, res) => {
		const { email } = req.params;

		const db = getDbConnection(process.env.MONGO_DB_NAME);
		const passwordResetCode = uuid();

		const { result } = await db.collection('users')
			.updateOne({ email }, {
				$set: { passwordResetCode }
			});

		if (result.nModified > 0) {
			try {
				await sendEmail({
					to: email,
					from: 'some.email@gmail.com',
					subject: 'Password Reset',
					text: `
						Uh oh, here's a link to reset your password:
						http://localhost:3000/reset-password/${passwordResetCode}
					`,
				});
			} catch (e) {
				console.log(e);
				res.sendStatus(500);
			}
		}

		res.sendStatus(200);
	},
}

module.exports = forgotPasswordRoute;