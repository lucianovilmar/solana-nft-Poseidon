import { NextResponse } from 'next/server';
import { getNftsByWalletAddress } from '../../services/helius';
import { updateWalletRanking, generateMockNftsForWallet, getNftStats, dbData } from '../../db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { addresses } = body;

        if (!addresses || !Array.isArray(addresses)) {
            return NextResponse.json({ error: 'addresses array is required' }, { status: 400 });
        }

        const apiKey = process.env.HELIUS_API_KEY;
        const allNfts: any[] = [];

        for (const address of addresses) {
            if (!address) continue;

            let walletNfts: any[] = [];
            let activeItems: any[] = [];
            let activeMints = new Set<string>();

            // 1. Fetch active wallet assets from blockchain via Helius API (single call!)
            try {
                const result = await getNftsByWalletAddress(apiKey, address);
                activeItems = result?.items || [];
                for (const nft of activeItems) {
                    if (nft.id) {
                        activeMints.add(nft.id.toLowerCase());
                    }
                }
            } catch (err) {
                console.error(`Failed to fetch active NFTs for wallet ${address} via Helius:`, err);
            }

            // 2. Fetch database NFTs for this wallet and determine burn status
            const dbNftsForWallet = dbData.filter(item => item.address && item.address.toLowerCase() === address.toLowerCase());
            for (const dbNft of dbNftsForWallet) {
                const isBurnt = !activeMints.has(dbNft.nftMint.toLowerCase());
                const nftObj = await getNftStats(dbNft.nftMint, dbNft.number, undefined, isBurnt);
                (nftObj as any).wallet = address;
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
                (nftObj as any).wallet = address;
                walletNfts.push(nftObj);
            }

            // 4. Fallback to mocks only if both blockchain and database return empty AND we are not in production
            if (walletNfts.length === 0 && process.env.NODE_ENV !== 'production') {
                walletNfts = generateMockNftsForWallet(address);
            }

            // Update this wallet's ranking dynamically in KV / local memory
            if (walletNfts.length > 0) {
                const totalPower = walletNfts.reduce((sum, item) => sum + (item.totalPower || 0), 0);
                await updateWalletRanking(address, totalPower, walletNfts.length);
            }

            allNfts.push(...walletNfts);
        }

        return NextResponse.json(allNfts, { status: 200 });
    } catch (error: any) {
        console.error("POST wallets error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
