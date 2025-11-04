import { RouteInfo } from './geolocation.service';

export interface PriceCalculation {
  basePrice: number;
  distancePrice: number;
  weightMultiplier: number;
  urgencyMultiplier: number;
  totalPrice: number;
  breakdown: {
    base: number;
    distance: number;
    weight: number;
    urgency: number;
  };
}

export interface PricingConfig {
  basePrice: number; // Precio base
  pricePerKm: number; // Precio por kilómetro
  weightRanges: Array<{
    min: number; // kg mínimo
    max: number; // kg máximo
    multiplier: number; // multiplicador de precio
  }>;
  urgencyLevels: Array<{
    level: 'standard' | 'express' | 'urgent';
    multiplier: number;
    description: string;
  }>;
}

class PricingService {
  private config: PricingConfig = {
    basePrice: 1500, // Precio base en pesos argentinos
    pricePerKm: 85, // Precio por kilómetro
    weightRanges: [
      { min: 0, max: 10, multiplier: 1.0 },
      { min: 10, max: 25, multiplier: 1.2 },
      { min: 25, max: 50, multiplier: 1.5 },
      { min: 50, max: 100, multiplier: 2.0 },
      { min: 100, max: Infinity, multiplier: 2.5 }
    ],
    urgencyLevels: [
      { level: 'standard', multiplier: 1.0, description: 'Entrega estándar (2-3 días)' },
      { level: 'express', multiplier: 1.5, description: 'Entrega express (24 horas)' },
      { level: 'urgent', multiplier: 2.0, description: 'Entrega urgente (mismo día)' }
    ]
  };

  calculatePrice(
    routeInfo: RouteInfo,
    weight: number = 5,
    urgency: 'standard' | 'express' | 'urgent' = 'standard'
  ): PriceCalculation {
    // Calcular precio base
    const basePrice = this.config.basePrice;

    // Calcular precio por distancia
    const distancePrice = routeInfo.distance * this.config.pricePerKm;

    // Calcular multiplicador por peso
    const weightRange = this.config.weightRanges.find(
      range => weight >= range.min && weight < range.max
    ) || this.config.weightRanges[0];
    const weightMultiplier = weightRange.multiplier;

    // Calcular multiplicador por urgencia
    const urgencyLevel = this.config.urgencyLevels.find(
      level => level.level === urgency
    ) || this.config.urgencyLevels[0];
    const urgencyMultiplier = urgencyLevel.multiplier;

    // Calcular precios individuales
    const breakdown = {
      base: basePrice,
      distance: distancePrice,
      weight: (basePrice + distancePrice) * (weightMultiplier - 1),
      urgency: (basePrice + distancePrice) * (urgencyMultiplier - 1)
    };

    // Calcular precio total
    const subtotal = basePrice + distancePrice;
    const totalPrice = Math.round(subtotal * weightMultiplier * urgencyMultiplier);

    return {
      basePrice,
      distancePrice,
      weightMultiplier,
      urgencyMultiplier,
      totalPrice,
      breakdown
    };
  }

  getWeightRanges() {
    return this.config.weightRanges;
  }

  getUrgencyLevels() {
    return this.config.urgencyLevels;
  }

  updatePricingConfig(newConfig: Partial<PricingConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Calcular precio estimado por zona
  getEstimatedPriceByZone(zone: 'capital' | 'gba' | 'interior'): {
    min: number;
    max: number;
    description: string;
  } {
    const zoneMultipliers = {
      capital: { min: 1.0, max: 1.5, description: 'Capital Federal' },
      gba: { min: 1.2, max: 2.0, description: 'Gran Buenos Aires' },
      interior: { min: 2.0, max: 4.0, description: 'Interior del país' }
    };

    const multiplier = zoneMultipliers[zone];
    const baseEstimate = this.config.basePrice + (20 * this.config.pricePerKm); // 20km promedio
    
    return {
      min: Math.round(baseEstimate * multiplier.min),
      max: Math.round(baseEstimate * multiplier.max),
      description: multiplier.description
    };
  }

  // Formatear precio en pesos argentinos
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  }
}

export const pricingService = new PricingService();