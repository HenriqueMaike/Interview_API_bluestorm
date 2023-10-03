import { createContext, ReactNode, useEffect, useState } from "react";

import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router'
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

type AuthContextData = {
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
}

type SignInProps = {
    username: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch {
        console.log('erro ao deslogar')
    }
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState('')
    const isAuthenticated = !!user;

    useEffect(() => {

        const { '@nextauth.token': token } = parseCookies();

        if (token) {
            api.get('/token-check').then(response => {
                const { message } = response.data;
            })
                .catch(() => {
                    signOut();
                })
        }

    }, [])

    async function signIn({ username, password }: SignInProps) {
        try {
            const response = await api.post('/login', {
                username,
                password
            })


            const { token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            })

            //passar para proximas requisicoes o token

            api.defaults.headers['Authorization'] = `Beares ${token}`

            //Redirecionar o user para o dashboard

            Router.push('/dashboard')

        } catch (err) {
            toast.error('Usuario/Senha Incorretos!')
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}