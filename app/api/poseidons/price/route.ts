import { NextResponse } from 'next/server';
import { kvSet, powerMap, badgeSet, getSvgImage } from '../../db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mint, buyPrice } = body;

        if (!mint) {
            return NextResponse.json({ error: 'mint address is required' }, { status: 400 });
        }

        const priceValue = parseFloat(buyPrice);
        if (isNaN(priceValue)) {
            return NextResponse.json({ error: 'Invalid buyPrice value' }, { status: 400 });
        }

        // Save price in KV / Local Memory
        await kvSet(`price:${mint}`, priceValue);

        // Determine Poseidon number
        let number = 0;
        const match = mint.match(/Poseidon(\d+)/i);
        if (match) {
            number = parseInt(match[1], 10);
        } else {
            let hash = 0;
            for (let i = 0; i < mint.length; i++) {
                hash = mint.charCodeAt(i) + ((hash << 5) - hash);
            }
            number = Math.abs(hash % 1273) + 1;
        }

        const nftInfo = powerMap.get(number);
        if (!nftInfo) {
            return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
        }

        const badge = badgeSet.has(mint) || (number % 8 === 0);
        const image = getSvgImage(number, nftInfo.rarity);

        const updatedNft = {
            number,
            mintAddress: mint,
            mint,
            name: `Poseidon #${number}`,
            image,
            badge,
            power: nftInfo.power,
            rarity: nftInfo.rarity,
            totalPower: badge ? nftInfo.power * 3 : nftInfo.power,
            trdBurned: (number % 4 === 0) ? number * 50 : 0,
            burnedPower: (number % 4 === 0) ? Math.round(nftInfo.power * 0.3) : 0,
            rewardsClaimed: Math.round(number * 0.8),
            rewardsAvailable: Math.round(number * 0.2),
            forSale: priceValue > 0,
            buyPrice: priceValue
        };

        return NextResponse.json(updatedNft, { status: 200 });
    } catch (error: any) {
        console.error("POST price error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
