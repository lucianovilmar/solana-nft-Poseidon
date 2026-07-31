import { NextResponse } from 'next/server';
import { getNftStats } from '../../../db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ mint: string }> | { mint: string } }
) {
    try {
        const resolvedParams = await params;
        const mint = resolvedParams.mint;

        if (!mint) {
            return NextResponse.json({ error: 'mint address is required' }, { status: 400 });
        }

        // Determine a fallback Poseidon number from the mint address in case it's not in the DB
        let fallbackNumber = 0;
        const match = mint.match(/Poseidon(\d+)/i);
        if (match) {
            fallbackNumber = parseInt(match[1], 10);
        } else {
            let hash = 0;
            for (let i = 0; i < mint.length; i++) {
                hash = mint.charCodeAt(i) + ((hash << 5) - hash);
            }
            fallbackNumber = Math.abs(hash % 1273) + 1;
        }

        const nftObj = await getNftStats(mint, fallbackNumber);
        return NextResponse.json(nftObj, { status: 200 });
    } catch (error: any) {
        console.error("GET mint error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
