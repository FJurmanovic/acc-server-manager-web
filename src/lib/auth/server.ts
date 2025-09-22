import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from '@/lib/session/config';
import { redirect } from 'next/navigation';

export async function getSession() {
	const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
	return session;
}

export async function requireAuth(skipRedirect?: boolean) {
	const session = await getSession();

	if (!skipRedirect && (!session.token || !session.user)) {
		redirect('/login');
	}

	return session;
}

export async function login(token: string, user: SessionData['user'], openToken?: string) {
	const session = await getSession();
	session.token = token;
	session.user = user;
	session.openToken = openToken;
	await session.save();
}

export async function logout() {
	'use server';
	const session = await getSession();
	session.destroy();
}
