import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const buildTime = process.env.BUILD_TIME || new Date().toISOString();
  
  return NextResponse.json({
    version: '1.0.0',
    buildTime,
    timestamp: new Date().toISOString(),
  });
}
