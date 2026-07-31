import { NextResponse } from 'next/server';
import { kvGet, kvSet } from '../db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, avatar, wallets } = body;

        if (!wallets || !Array.isArray(wallets) || wallets.length === 0) {
            return NextResponse.json({ error: 'Wallets list is required' }, { status: 400 });
        }

        // Busca o perfil existente de uma das carteiras para preservar dados como paidUntil
        const existingProfile = await kvGet<any>(`user:${wallets[0]}`);

        const userProfile = {
            id: existingProfile?.id || Date.now(),
            name: name || existingProfile?.name || 'Unnamed User',
            avatar: avatar || existingProfile?.avatar || '',
            image: avatar || existingProfile?.image || '', // Mantém compatibilidade
            wallets,
            isHolder: existingProfile?.isHolder !== undefined ? existingProfile.isHolder : true,
            paidUntil: existingProfile?.paidUntil || 0
        };

        // Persiste sob todas as carteiras vinculadas
        for (const walletAddress of wallets) {
            await kvSet(`user:${walletAddress}`, userProfile);
        }

        return NextResponse.json(userProfile, { status: 200 });
    } catch (error: any) {
        console.error("POST user error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
