import { NextResponse } from 'next/server';
import { kvGet } from '../../db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ wallet: string }> | { wallet: string } }
) {
    try {
        // Handle Promise-based params for Next.js 15+ compatibility
        const resolvedParams = await params;
        const wallet = resolvedParams.wallet;

        if (!wallet) {
            return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
        }

        const user = await kvGet<any>(`user:${wallet}`);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error("GET user error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
