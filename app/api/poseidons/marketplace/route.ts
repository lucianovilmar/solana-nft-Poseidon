import { NextResponse } from 'next/server';
import { getNftStats } from '../../db';

export async function GET(request: Request) {
    try {
        const symbol = 'poseidons';
        const url = `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=0&limit=100`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Magic Eden API responded with status ${response.status}`);
        }

        const listings = await response.json();
        
        const mappedListings = await Promise.all(listings.map(async (listing: any) => {
            const mint = listing.tokenMint || listing.tokenAddress;
            const price = listing.price || 0;
            const name = listing.token?.name || `Poseidon #${mint.slice(0, 4)}`;
            
            // Extrai o número do NFT do nome (ex: "Poseidon #631" -> 631)
            const match = name.match(/#(\d+)/);
            const fallbackNumber = match ? parseInt(match[1], 10) : 0;
            
            // Busca os dados reais de poder e metadados no nosso db local
            const nftObj = await getNftStats(mint, fallbackNumber);
            
            return {
                ...nftObj,
                buyPrice: price,
                priceFormatted: `${price.toFixed(3)} SOL`,
                pricePower: nftObj.totalPower > 0 ? parseFloat((price / (nftObj.totalPower / 1000)).toFixed(6)) : 0,
                wallet: listing.seller || ''
            };
        }));

        return NextResponse.json(mappedListings, { status: 200 });
    } catch (error: any) {
        console.error("GET marketplace error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
