import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'

export const options: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				name: {
					label: 'Username',
					type: 'text',
				},
				email: {
					label: 'Email',
					type: 'text',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			async authorize(credentials) {
				const user = { id: '123', name: credentials?.name, email: credentials?.email, password: credentials?.password }

				console.log(credentials)

				return user
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.email = user.email
				token.name = user.name
				token.token = jwt.sign({ name: user.name, email: user.email }, process.env.NEXTAUTH_SECRET!, { expiresIn: '24h' })
			}
			return token
		},
		async session({ session, token }) {
			session.user!.email = token.email
			session.user!.name = token.name
			//@ts-ignore
			session.user!.token = token.token

			return session
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: 60 * 60 * 24,
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
	},
	pages: {
		signIn: '/sign-in',
	},
}
