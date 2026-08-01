import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        urlDefined: typeof process.env.KV_REST_API_URL !== 'undefined',
        tokenDefined: typeof process.env.KV_REST_API_TOKEN !== 'undefined',
        urlValuePrefix: process.env.KV_REST_API_URL ? process.env.KV_REST_API_URL.slice(0, 15) : 'none'
    });
}
