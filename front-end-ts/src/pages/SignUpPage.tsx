import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
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

    const mutation = useMutation({
        mutationFn: async () => {
            return await axios.post('/api/signup', {
				email,
				password,
			});
        },
        onError(error, variables, context) {
            console.log(error);
        },
        onSuccess(data, variables, context) {
            const { token } = data.data;
			setToken(token);
			navigate('/please-verify');
        }
    });

    const onSignUpClicked = async () => {
        setErrorMessage('');
        if (password !== confirmPassword) {
            setErrorMessage('The passwords don\'t match');
        } else {
            mutation.mutate();
        }
    }

	return (
        <div className="content-container">
            <h1>Sign Up</h1>
			{errorMessage && <p>{errorMessage}</p>}
            {mutation.isLoading && <div className="loading">Creating new user...</div>}
            {mutation.isError && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
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
                    !email && !password ||
                    password !== confirmPassword
                }
                onClick={onSignUpClicked}>Sign Up</button>
            <button onClick={() => navigate('/login')}>Already have an account? Log in</button>
        </div>
    )
}