import { NextResponse } from 'next/server';
import { kvSet } from '../db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, avatar, wallets } = body;

        if (!wallets || !Array.isArray(wallets) || wallets.length === 0) {
            return NextResponse.json({ error: 'Wallets list is required' }, { status: 400 });
        }

        const userProfile = {
            id: Date.now(),
            name: name || 'Unnamed User',
            avatar: avatar || '',
            image: avatar || '', // Map both image and avatar for frontend compatibility
            wallets,
            isHolder: true
        };

        // Persist under all linked wallets so they can load it from any connected wallet
        for (const walletAddress of wallets) {
            await kvSet(`user:${walletAddress}`, userProfile);
        }

        return NextResponse.json(userProfile, { status: 200 });
    } catch (error: any) {
        console.error("POST user error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
