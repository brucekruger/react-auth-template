import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../auth/useToken';

export const LogInPage = () => {
	const [, setToken] = useToken();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);
    // const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorMessage] = useState<string>('');
    const navigate = useNavigate();

    const onLogInClicked = async () => {
		const response = await axios.post('/api/login', {
			email,
			password,
		});
		const { token } = response.data;
		setToken(token);
		navigate('/');
    }

	return (
        <div className="content-container">
            <h1>Log In</h1>
            {errorMessage && <div className='fail'>{errorMessage}</div>}
            <input
                placeholder="someone@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)} />
            <input
                placeholder="Password"
                type={shouldShowPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)} />
            <button onClick={() => setShouldShowPassword(!shouldShowPassword)}>Show Password</button>
            <hr/>
            <button
                disabled={!email || !password}
                onClick={onLogInClicked}>Log In</button>
            <button onClick={() => navigate('/forgot-password')}>Forgot your password?</button>
            <button onClick={() => navigate('/signup')}>Don't have an account? Sign up</button>
        </div>
    )
}