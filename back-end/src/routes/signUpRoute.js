const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { getDbConnection } = require('../db');
const { sendEmail } = require('../util/sendEmail');

const signUpRoute = {
	path: '/api/signup',
	method: 'post',
	handler: async (req, res) => {
		const { email, password } = req.body;

		const db = getDbConnection(process.env.MONGO_DB_NAME);
		const user = await db.collection('users').findOne({ email });

		if (user) {
			return res.sendStatus(409); // 409 = "Conflict"
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const verificationString = uuid();

		const startingInfo = {
			hairColor: '',
			favoriteFood: '',
			bio: '',
		};

		const result = await db.collection('users').insertOne({
			email,
			isVerified: false,
			passwordHash,
			info: startingInfo,
			verificationString,
		});

		const { insertedId } = result;

		// try {
		// 	await sendEmail({
		// 		to: email,
		// 		from: 'some.email@gmail.com',
		// 		subject: 'Please Verify Your Email',
		// 		text: `
		// 			Thanks for signing up! To verify your email, you just need to click this link:
		// 			http://localhost:3000/verify-email/${verificationString}
		// 		`
		// 	});
		// } catch (e) {
		// 	console.log(e);
		// 	return res.sendStatus(500);
		// }
		
		jwt.sign({
			id: insertedId,
			isVerified: false,
			email,
			info: startingInfo,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '2d',
		},
		(err, token) => {
			if (err) {
				return res.status(500).send(err);
			}

			res.status(200).send({ token });
		});
	}
}

module.exports = signUpRoute;