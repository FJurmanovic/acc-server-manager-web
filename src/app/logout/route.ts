import { logout } from '@/lib/auth/server';
import { redirect, RedirectType } from 'next/navigation';

export async function GET() {
	await logout();
	redirect('/login', RedirectType.replace);
}
