import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAutoRedirect = (url: string, delay: number) => {
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate(url);
		}, delay);
	}, [navigate, delay, url]);
}