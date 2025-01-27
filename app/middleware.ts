// import { NextRequest, NextResponse } from 'next/server'

// export async function middleware(request: NextRequest) {
// 	const { cookies, nextUrl } = request

// 	const { pathname } = request.nextUrl

// 	const token = cookies.get('next-auth.session-token')
// 	const isAuthorized = !!token
// 	const isAuthPage = nextUrl.pathname === '/sign-in'

// 	if (!isAuthorized && !isAuthPage) {
// 		return NextResponse.redirect(new URL('/sign-in', request.url))
// 	}

// 	if (pathname.startsWith('/sign-in') && isAuthorized) {
// 		return NextResponse.redirect(new URL('/start-planning', request.url))
// 	}

// 	return NextResponse.next()
// }

// export const config = {
// 	matcher: ['/sign-in', '/start-planning'],
// }
