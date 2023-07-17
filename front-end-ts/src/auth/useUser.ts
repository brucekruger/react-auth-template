import { useState, useEffect } from 'react';
import { useToken } from './useToken';

export const useUser = (): any => {
	const [token] = useToken();

	const getPayloadFromToken = (token: string) => {
		const encodedPayload = token.split('.')[1];
		const decodedPayloadData = atob(encodedPayload);
		let userData = JSON.parse(decodedPayloadData);
		if(typeof(userData.info) === "string")
		{
			userData.info = JSON.parse(userData.info);
		}
		return userData;
	}

	const [user, setUser] = useState(() => {
		if (!token) return null;
		return getPayloadFromToken(token);
	});

	useEffect(() => {
		if (!token) {
			setUser(null);
		} else {
			setUser(getPayloadFromToken(token));
		}
	}, [token]);

	return user;
}