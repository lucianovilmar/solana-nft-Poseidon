import { NextResponse } from 'next/server';
import { getNftsByWalletAddress, checkAssetBurnt } from '../../../services/helius';
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

        // 1. Fetch any NFTs registered to this wallet in our database message (1).txt
        const dbNftsForWallet = dbData.filter(item => item.address && item.address.toLowerCase() === walletAddress.toLowerCase());
        for (const dbNft of dbNftsForWallet) {
            const isBurnt = await checkAssetBurnt(apiKey, dbNft.nftMint);
            const nftObj = await getNftStats(dbNft.nftMint, dbNft.number, undefined, isBurnt);
            walletNfts.push(nftObj);
        }

        // 2. Fetch active wallet assets from blockchain via Helius API
        if (apiKey && apiKey.trim() !== '') {
            try {
                const result = await getNftsByWalletAddress(apiKey, walletAddress);
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
                    walletNfts.push(nftObj);
                }
            } catch (err) {
                console.error(`Failed to fetch NFTs for wallet ${walletAddress} via Helius:`, err);
            }
        }

        // 3. Fallback to mocks only if both blockchain and database return empty
        if (walletNfts.length === 0) {
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
