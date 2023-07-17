import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ForgotPasswordPage = () => {
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');

	const navigate = useNavigate();

	const onForgotPasswordClicked = async () => {
		try {
			await axios.put(`/api/forgot-password/${email}`);
			setIsSuccess(true);
			setTimeout(() => {
				navigate('/login');
			}, 3000);
		} catch (e) {
			setErrorMessage('Uh oh... something went wrong');
		}
	}

	return isSuccess ? (
		<div className="content-container">
			<h1>Success!</h1>
			<p>Check your email for a reset link</p>
		</div>
	) : (
		<div className="content-container">
			<h1>Forgot Password</h1>
			<p>Enter your email and we'll send you a reset link</p>
			{errorMessage && <div>{errorMessage}</div>}
			<input
				value={email}
				placeholder="someone@gmail.com"
				onChange={e => setEmail(e.target.value)} />
			<button
				disabled={!email}
				onClick={onForgotPasswordClicked}
			>Send Reset Email</button>
		</div>
	)
}