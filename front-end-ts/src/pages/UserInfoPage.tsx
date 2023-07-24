import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';

export const UserInfoPage = () => {
	const [token, setToken] = useToken();
	const user = useUser();

    console.log("user info", user);

	const { id, email, isVerified, info } = user;

    // We'll use the history to navigate the user
    // programmatically later on (we're not using it yet)
    const navigate = useNavigate();

    // These states are bound to the values of the text inputs
    // on the page (see JSX below). 
    const [favoriteFood, setFavoriteFood] = useState<string>(info.favoriteFood || '');
    const [hairColor, setHairColor] = useState<string>(info.hairColor || '');
    const [bio, setBio] = useState<string>(info.bio || '');
    
    const mutation = useMutation({
        mutationFn: async () => {
            return await axios.put(`/api/users/${id}`, {
                    favoriteFood,
                    hairColor,
                    bio,
                }, {
                    headers: { Authorization: `Bearer ${token}`},
                });
            },
        onError: (error, variables, context) => {
            console.log(error);
        },
        onSuccess: (data, variables, context) => {
            const { token: newToken } = data.data;
            setToken(newToken);
        }
    })

    const saveChanges = () => {
		mutation.mutate();
    }

    const logOut = () => {
		setToken('');
		navigate('/login');
    }
    
    const resetValues = () => {
        setFavoriteFood(info.favoriteFood);
        setHairColor(info.hairColor);
        setBio(info.bio);
    }
    
    // And here we have the JSX for our component. It's pretty straightforward
    return (
        <div className="content-container">
            <h1>Info for {email}</h1>
			{!isVerified && <div className="fail">You won't be able to make any changes until you verify your email</div>}
            {mutation.isLoading && <div className="loading">Updating user data...</div>}
            {mutation.isSuccess && <div className="success">Successfully saved user data!</div>}
            {mutation.isError && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
            <label>
                Favorite Food:
                <input
                    onChange={e => setFavoriteFood(e.target.value)}
                    value={favoriteFood} />
            </label>
            <label>
                Hair Color:
                <input
                    onChange={e => setHairColor(e.target.value)}
                    value={hairColor} />
            </label>
            <label>
                Bio:
                <input
                    onChange={e => setBio(e.target.value)}
                    value={bio} />
            </label>
            <hr />
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={resetValues}>Reset Values</button>
            <button onClick={logOut}>Log Out</button>
        </div>
    );
}