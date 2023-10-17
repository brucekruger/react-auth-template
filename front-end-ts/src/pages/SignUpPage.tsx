import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../auth/useToken';

export const SignUpPage = () => {
	const [, setToken] = useToken();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
    const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const onSignUpClicked = async () => {
		setErrorMessage('');
		if (password !== confirmPassword) {
			setErrorMessage('The passwords don\'t match');
		} else {
			const response = await axios.post('/api/signup', {
				email,
				password,
			});
			const { token } = response.data;
			setToken(token);
			navigate('/please-verify');
		}
    }

	return (
        <div className="content-container">
            <h1>Sign Up</h1>
			{errorMessage && <p>{errorMessage}</p>}
            <input
                placeholder="someone@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)} />
            <input
                placeholder="Password"
                type={shouldShowPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)} />
            <input
                placeholder="Confirm Password"
                type={shouldShowPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} />
            <button onClick={() => setShouldShowPassword(!shouldShowPassword)}>Show Password</button>
            <hr/>
            <button disabled={
                    (!email && !password) ||
                    password !== confirmPassword
                }
                onClick={onSignUpClicked}>Sign Up</button>
            <button onClick={() => navigate('/login')}>Already have an account? Log in</button>
        </div>
    )
}