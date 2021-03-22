import { useEffect, useRef, useReducer } from 'react';

type State = {
  status: string,
  error?: string | null,
  data?: any
}

type Action = 
| { type: 'FETCHING' }
| { type: 'FETCHED', payload: string | null }
| { type: 'FETCH_ERROR', payload: string };

export const useFetch = (url: string) => {
	const cache: any = useRef({});

	const initialState: State = {
		status: 'idle',
		error: null,
		data: undefined,
	};

	const [state, dispatch] = useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'FETCHING':
				return { ...initialState, status: 'fetching' };
			case 'FETCHED':
				return { ...initialState, status: 'fetched', data: action.payload };
			case 'FETCH_ERROR':
				return { ...initialState, status: 'error', error: action.payload };
			default:
				return state;
		}
	}, initialState);

	useEffect(() => {
		let cancelRequest = false;
		if (!url) return;

		const fetchData = async () => {
			dispatch({ type: 'FETCHING' });
			if (cache.current[url]) {
				const data = cache.current[url];
				dispatch({ type: 'FETCHED', payload: data });
			} else {
				try {
					const response = await fetch(url);
					const data = await response.json();
					cache.current[url] = data;
					if (cancelRequest) return;
					dispatch({ type: 'FETCHED', payload: data });
				} catch (error) {
					if (cancelRequest) return;
					dispatch({ type: 'FETCH_ERROR', payload: error.message });
				}
			}
		};

		fetchData();

		return function cleanup() {
			cancelRequest = true;
		};
	}, [url]);

	return state;
};