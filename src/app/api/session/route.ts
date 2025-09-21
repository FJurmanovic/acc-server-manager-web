import { requireAuth } from '@/lib/auth/server';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
	const session = await requireAuth(true);
	return NextResponse.json({ openToken: session.openToken });
}
export async function DELETE(): Promise<void> {
	const session = await requireAuth(true);
	session.destroy();
}
