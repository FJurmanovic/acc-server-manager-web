import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from '@/lib/session/config';
import { redirect } from 'next/navigation';

export async function getSession() {
	const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
	return session;
}

export async function requireAuth() {
	const session = await getSession();

	if (!session.token || !session.user) {
		redirect('/logout');
	}

	return session;
}

export async function login(token: string, user: SessionData['user']) {
	const session = await getSession();
	session.token = token;
	session.user = user;
	await session.save();
}

export async function logout() {
	const session = await getSession();
	session.destroy();
}
