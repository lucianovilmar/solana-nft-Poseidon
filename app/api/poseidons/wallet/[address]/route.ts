import { NextResponse } from 'next/server';
import { getNftsByWalletAddress } from '../../../services/helius';
import { generateMockNftsForWallet, getNftStats, dbData } from '../../../db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ address: string }> | { address: string } }
) {
    try {
        const resolvedParams = await params;
        const walletAddress = resolvedParams.address;
        
        const { searchParams } = new URL(request.url);
        const queryNumber = searchParams.get('number') ? parseInt(searchParams.get('number')!, 10) : null;

        if (!walletAddress) {
            return NextResponse.json({ error: 'wallet address is required' }, { status: 400 });
        }

        const apiKey = process.env.HELIUS_API_KEY;
        let walletNfts: any[] = [];
        let activeItems: any[] = [];
        let activeMints = new Set<string>();

        // 1. Fetch active wallet assets from blockchain via Helius API (single call!)
        try {
            const result = await getNftsByWalletAddress(apiKey, walletAddress);
            activeItems = result?.items || [];
            for (const nft of activeItems) {
                if (nft.id) {
                    activeMints.add(nft.id.toLowerCase());
                }
            }
        } catch (err) {
            console.error(`Failed to fetch active NFTs for wallet ${walletAddress} via Helius:`, err);
        }

        // 2. Fetch database NFTs and determine burn status
        const dbNftsForWallet = dbData.filter(item => item.address && item.address.toLowerCase() === walletAddress.toLowerCase());
        for (const dbNft of dbNftsForWallet) {
            const isBurnt = !activeMints.has(dbNft.nftMint.toLowerCase());
            const nftObj = await getNftStats(dbNft.nftMint, dbNft.number, undefined, isBurnt);
            walletNfts.push(nftObj);
        }

        // 3. Add active on-chain NFTs that are not in the database
        for (const nft of activeItems) {
            if (walletNfts.some(existing => existing.mint.toLowerCase() === nft.id.toLowerCase())) {
                continue;
            }

            const name = nft.content?.metadata?.name || "Unnamed NFT";
            const match = name.match(/#(\d+)/);
            const fallbackNumber = match ? parseInt(match[1], 10) : 0;
            const image = nft.content?.files?.[0]?.uri || nft.content?.links?.image || "";

            const nftObj = await getNftStats(nft.id, fallbackNumber, image, false);
            walletNfts.push(nftObj);
        }

        // 4. Fallback to mocks only if both blockchain and database return empty AND we are not in production
        if (walletNfts.length === 0 && process.env.NODE_ENV !== 'production') {
            walletNfts = generateMockNftsForWallet(walletAddress);
        }

        if (queryNumber !== null) {
            walletNfts = walletNfts.filter(n => n.number === String(queryNumber));
        }

        const statusCode = walletNfts.length > 0 ? 200 : 404;
        return NextResponse.json(walletNfts, { status: statusCode });
    } catch (error: any) {
        console.error("GET wallet address error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
