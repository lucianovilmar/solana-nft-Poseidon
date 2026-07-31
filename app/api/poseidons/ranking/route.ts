import { NextResponse } from 'next/server';
import { getRealRankings } from '../../db';

export async function GET() {
    try {
        const rankings = await getRealRankings();
        return NextResponse.json(rankings, { status: 200 });
    } catch (error: any) {
        console.error("GET ranking error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
