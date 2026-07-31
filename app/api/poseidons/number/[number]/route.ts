import { NextResponse } from 'next/server';
import { getNftByNumber } from '../../../db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ number: string }> | { number: string } }
) {
    try {
        const resolvedParams = await params;
        const numberStr = resolvedParams.number;
        const number = parseInt(numberStr, 10);

        if (isNaN(number) || number < 1 || number > 1633) {
            return NextResponse.json({ error: 'Invalid Poseidon number' }, { status: 400 });
        }

        const nftObj = await getNftByNumber(number);
        return NextResponse.json(nftObj, { status: 200 });
    } catch (error: any) {
        console.error("GET number error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
