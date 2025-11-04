import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!origin || !destination) {
    return NextResponse.json({ 
      error: 'Both origin and destination parameters are required' 
    }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ 
      error: 'Google Maps API key not configured' 
    }, { status: 500 });
  }

  try {
    console.log('🛣️ Directions request:', origin, '→', destination);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    console.log('📡 Directions API response status:', data.status);
    
    if (data.status === 'OK') {
      console.log('✅ Route calculation successful');
      return NextResponse.json(data);
    } else {
      console.log('❌ Route calculation failed:', data.status, data.error_message);
      return NextResponse.json({
        error: `Directions failed: ${data.status}`,
        details: data.error_message
      }, { status: 400 });
    }
  } catch (error) {
    console.error('💥 Directions error:', error);
    return NextResponse.json({
      error: 'Internal server error during route calculation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}