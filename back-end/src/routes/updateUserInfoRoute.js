const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDbConnection } = require('../db');

const updateUserInfoRoute = {
	path: '/api/users/:userId',
	method: 'put',
	handler: async (req, res) => {
		const { authorization } = req.headers;
		const { userId } = req.params;

		if (!authorization) {
			return res.status(401).json({ message: 'No authorization header sent' });
		}

		const updates = (({
			favoriteFood,
			hairColor,
			bio,
		}) => ({
			favoriteFood,
			hairColor,
			bio,
		}))(req.body);

		const token = authorization.split(' ')[1];

		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) return res.status(401).json({ message: 'Unable to verify token' });

			const { id, isVerified } = decoded;

			if (id !== userId) return res.send(403).json({ message: 'Not allowed to update that user\'s data' });
			// if (!isVerified) return res.send(403).json({ message: 'You need to verify your email before you can update' });

			const db = getDbConnection(process.env.MONGO_DB_NAME);
			const result = await db.collection('users').findOneAndUpdate(
				{ _id: ObjectId(id) },
				{ $set: { info: updates } },
				{ returnOriginal: false },
			);

			const { email, info } = result.value;

			jwt.sign(
				{ id, email, isVerified, info },
				process.env.JWT_SECRET,
				{ expiresIn: '2d' },
				(err, token) => {
					if (err) {
						return res.send(500).json(err);
					}

					res.status(200).json({ token });
				});
		});
	}
}

module.exports = updateUserInfoRoute;