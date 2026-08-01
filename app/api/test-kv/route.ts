import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        KV_REST_API_URL: typeof process.env.KV_REST_API_URL !== 'undefined',
        KV_REST_API_TOKEN: typeof process.env.KV_REST_API_TOKEN !== 'undefined',
        UPSTASH_REDIS_REST_URL: typeof process.env.UPSTASH_REDIS_REST_URL !== 'undefined',
        UPSTASH_REDIS_REST_TOKEN: typeof process.env.UPSTASH_REDIS_REST_TOKEN !== 'undefined',
        REDIS_URL: typeof process.env.REDIS_URL !== 'undefined'
    });
}
