import { NextResponse } from 'next/server';
import { backupData } from '../../../db';

export async function GET() {
    try {
        // Sort real backup NFTs by power descending
        const sorted = [...backupData].sort((a, b) => b.power - a.power);
        
        // Map the top 15 items to match the old backend schema and use the working Tensor CDN URLs
        const topItems = sorted.slice(0, 15).map(item => {
            let number = 1;
            const match = item.image.match(/%2F(\d+)\.png/i) || item.image.match(/\/(\d+)\.png/i);
            if (match) {
                number = parseInt(match[1], 10);
            }

            const image = `https://prod-image-cdn.tensor.trade/images/slug=8ccb22e9-71e1-49dc-8437-b9d2791c6359/400x400/freeze=false/https%3A%2F%2Fshdw-drive.genesysgo.net%2FDRRe9dZkP199W6GLrySn2xj2ayfr8gin8iaBt1YVMN9M%2F${number}.png`;

            return {
                mint: item.mint,
                image,
                power: item.power,
                trdBurned: item.trdBurned,
                nftBurned: item.nftBurned,
                burnedPower: item.burnedPower
            };
        });

        return NextResponse.json(topItems, { status: 200 });
    } catch (error: any) {
        console.error("GET carousel error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
