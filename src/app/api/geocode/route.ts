import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Maps API key not configured' }, { status: 500 });
  }

  try {
    console.log('🌐 Geocoding request for:', address);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    console.log('📡 Google Maps API response status:', data.status);
    
    if (data.status === 'OK') {
      console.log('✅ Geocoding successful');
      return NextResponse.json(data);
    } else {
      console.log('❌ Geocoding failed:', data.status, data.error_message);
      return NextResponse.json({
        error: `Geocoding failed: ${data.status}`,
        details: data.error_message
      }, { status: 400 });
    }
  } catch (error) {
    console.error('💥 Geocoding error:', error);
    return NextResponse.json({
      error: 'Internal server error during geocoding',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}