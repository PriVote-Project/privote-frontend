import { NextResponse, type NextRequest } from 'next/server';
import { pinata } from '@/config/pinata';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { cid } = await pinata.upload.public.json(data);
    const url = await pinata.gateways.public.convert(cid);
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
