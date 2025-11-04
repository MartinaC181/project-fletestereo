'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RouteInfo } from '@/lib/services/geolocation.service';
import { pricingService, PriceCalculation } from '@/lib/services/pricing.service';
import { Calculator, Package, Clock, DollarSign } from 'lucide-react';

interface PriceCalculatorProps {
  routeInfo: RouteInfo | null;
  onPriceCalculated?: (calculation: PriceCalculation) => void;
}

export const PriceCalculator = ({ routeInfo, onPriceCalculated }: PriceCalculatorProps) => {
  const [weight, setWeight] = useState<number>(5);
  const [urgency, setUrgency] = useState<'standard' | 'express' | 'urgent'>('standard');
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);

  const urgencyLevels = pricingService.getUrgencyLevels();

  useEffect(() => {
    if (routeInfo && weight > 0) {
      const calculation = pricingService.calculatePrice(routeInfo, weight, urgency);
      setPriceCalculation(calculation);
      onPriceCalculated?.(calculation);
    }
  }, [routeInfo, weight, urgency, onPriceCalculated]);

  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setWeight(numValue);
    }
  };

  if (!routeInfo) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Precios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Primero calcula la ruta para obtener una cotización
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculadora de Precios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuración del envío */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Peso (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              min="0"
              step="0.1"
              placeholder="Peso en kilogramos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tipo de envío
            </Label>
            <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level.level} value={level.level}>
                    <div className="flex flex-col">
                      <span className="capitalize">{level.level}</span>
                      <span className="text-xs text-gray-500">{level.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desglose de precios */}
        {priceCalculation && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Desglose de Precios
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Precio base:</span>
                  <span>{pricingService.formatPrice(priceCalculation.breakdown.base)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Distancia ({routeInfo.distance.toFixed(1)} km):</span>
                  <span>{pricingService.formatPrice(priceCalculation.breakdown.distance)}</span>
                </div>
                
                {priceCalculation.breakdown.weight > 0 && (
                  <div className="flex justify-between">
                    <span>Recargo por peso ({weight} kg):</span>
                    <span>+{pricingService.formatPrice(priceCalculation.breakdown.weight)}</span>
                  </div>
                )}
                
                {priceCalculation.breakdown.urgency > 0 && (
                  <div className="flex justify-between">
                    <span>Recargo por urgencia:</span>
                    <span>+{pricingService.formatPrice(priceCalculation.breakdown.urgency)}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">
                  {pricingService.formatPrice(priceCalculation.totalPrice)}
                </span>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-blue-800">
                <strong>Tiempo estimado:</strong> {Math.round(routeInfo.duration)} minutos
              </p>
              <p className="text-blue-700 mt-1">
                Este precio es una estimación. El costo final puede variar según condiciones específicas del envío.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};