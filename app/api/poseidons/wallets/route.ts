import { NextResponse } from 'next/server';
import { getNftsByWalletAddress, checkAssetBurnt } from '../../services/helius';
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

            // 1. Fetch any NFTs registered to this wallet in our database message (1).txt (staking database)
            const dbNftsForWallet = dbData.filter(item => item.address && item.address.toLowerCase() === address.toLowerCase());
            for (const dbNft of dbNftsForWallet) {
                const isBurnt = await checkAssetBurnt(apiKey, dbNft.nftMint);
                const nftObj = await getNftStats(dbNft.nftMint, dbNft.number, undefined, isBurnt);
                (nftObj as any).wallet = address;
                walletNfts.push(nftObj);
            }

            // 2. Fetch active wallet assets from blockchain via Helius API
            if (apiKey && apiKey.trim() !== '') {
                try {
                    const result = await getNftsByWalletAddress(apiKey, address);
                    const items = result?.items || [];
                    
                    for (const nft of items) {
                        // Skip if already loaded from database
                        if (walletNfts.some(existing => existing.mint === nft.id)) {
                            continue;
                        }

                        const name = nft.content?.metadata?.name || "Unnamed NFT";
                        const match = name.match(/#(\d+)/);
                        const fallbackNumber = match ? parseInt(match[1], 10) : 0;
                        const image = nft.content?.files?.[0]?.uri || nft.content?.links?.image || "";

                        const nftObj = await getNftStats(nft.id, fallbackNumber, image);
                        // Inject owner wallet
                        (nftObj as any).wallet = address;
                        walletNfts.push(nftObj);
                    }
                } catch (err) {
                    console.error(`Failed to fetch NFTs for wallet ${address} via Helius:`, err);
                }
            }

            // 3. Fallback to mocks only if both blockchain and database return empty
            if (walletNfts.length === 0) {
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
