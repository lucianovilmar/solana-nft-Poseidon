import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Daily burn history data for the statistics charts
        const burnHistory = [
            { date: "2026-07-01", trdBurned: 5000, trdBburned: 5000, nftBurned: 1, totalPower: 4500 },
            { date: "2026-07-05", trdBurned: 12000, trdBburned: 12000, nftBurned: 2, totalPower: 11000 },
            { date: "2026-07-10", trdBurned: 24000, trdBburned: 24000, nftBurned: 4, totalPower: 26000 },
            { date: "2026-07-15", trdBurned: 38000, trdBburned: 38000, nftBurned: 6, totalPower: 48000 },
            { date: "2026-07-20", trdBurned: 49000, trdBburned: 49000, nftBurned: 8, totalPower: 65000 },
            { date: "2026-07-25", trdBurned: 65000, trdBburned: 65000, nftBurned: 11, totalPower: 92000 }
        ];
        return NextResponse.json(burnHistory, { status: 200 });
    } catch (error: any) {
        console.error("GET burn error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
