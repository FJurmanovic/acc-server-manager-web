import { SessionOptions } from 'iron-session';
import { User } from '@/lib/types';

export interface SessionData {
	token?: string;
	user?: User;
}

export const sessionOptions: SessionOptions = {
	password: process.env.SECRET || 'development-secret-key-must-be-32-characters-long',
	cookieName: 'acc-session',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 30 * 24 * 60 * 60 // 30 days
	}
};
