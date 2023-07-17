const forgotPasswordRoute = require('./forgotPasswordRoute');
const logInRoute = require('./logInRoute');
const resetPasswordRoute = require('./resetPasswordRoute');
const signUpRoute = require('./signUpRoute');
// const testRoute = require('./testRoute');
const updateUserInfoRoute = require('./updateUserInfoRoute');
const verifyEmailRoute = require('./verifyEmailRoute');

const routes = [
    forgotPasswordRoute,
	logInRoute,
	resetPasswordRoute,
	signUpRoute,
    // testRoute,
	updateUserInfoRoute,
	verifyEmailRoute,
];

module.exports = routes;
