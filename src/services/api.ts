import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './errors/AuthTokenError';
import { signOut } from '@/contexts/AuthContext';

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'https://djbnrrib9e.execute-api.us-east-2.amazonaws.com/v1',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response?.status === 400) {
            if (typeof window !== undefined) {
                signOut();
            }
        } else {
            return Promise.reject(new AuthTokenError())
        }

        return Promise.reject(error);
    })

    return api;
}