import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const mode = searchParams.get('mode') || 'driving'; // Por defecto driving
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

  // Validar modo de transporte
  const validModes = ['driving', 'walking', 'bicycling', 'transit'];
  if (!validModes.includes(mode)) {
    return NextResponse.json({ 
      error: `Invalid travel mode. Must be one of: ${validModes.join(', ')}` 
    }, { status: 400 });
  }

  try {
    console.log('🛣️ Directions request:', origin, '→', destination, `(modo: ${mode})`);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&avoid=tolls&alternatives=true&key=${apiKey}`
    );
    
    const data = await response.json();
    
    console.log('📡 Directions API response status:', data.status);
    
    if (data.status === 'OK' && data.routes.length > 0) {
      console.log('✅ Route calculation successful');
      
      // Si hay múltiples rutas, seleccionar la más corta
      let shortestRoute = data.routes[0];
      let shortestDistance = data.routes[0].legs[0].distance.value;
      
      if (data.routes.length > 1) {
        console.log(`🔍 Analizando ${data.routes.length} rutas alternativas para encontrar la más corta`);
        
        data.routes.forEach((route, index) => {
          const routeDistance = route.legs[0].distance.value;
          console.log(`   Ruta ${index + 1}: ${(routeDistance / 1000).toFixed(2)} km`);
          
          if (routeDistance < shortestDistance) {
            shortestRoute = route;
            shortestDistance = routeDistance;
          }
        });
        
        console.log(`✅ Ruta más corta seleccionada: ${(shortestDistance / 1000).toFixed(2)} km`);
      }
      
      return NextResponse.json({
        ...data,
        routes: [shortestRoute] // Devolver solo la ruta más corta
      });
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