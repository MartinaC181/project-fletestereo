"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
// (M6) Importamos los tipos y el servicio correctos
import { freightService } from "@/modules/freight/FreightService";
import type { QuoteData, ServiceType } from "@/core/events/domain-events";

export function PriceCalculator() {
  const [formData, setFormData] = useState({
    origen: "Corrientes, Argentina",
    destino: "",
    tipoServicio: "" as ServiceType,
    pisosEscalera: 0,
  });

  const [quoteResult, setQuoteResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    name: keyof typeof formData,
    value: string | number | ServiceType
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setQuoteResult(null); // Resetea el resultado si cambian los datos
    setError(null);
  };

  /**
   * (M2) Llama al 'freightService' unificado
   */
  const handleCalculate = async () => {
    if (!formData.origen || !formData.destino || !formData.tipoServicio) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // 1. Creamos el objeto QuoteData (M6)
      const quoteData: QuoteData = {
        origen: formData.origen,
        destino: formData.destino,
        tipoServicio: formData.tipoServicio,
        pisosEscalera: Number(formData.pisosEscalera) || 0,
        // Rellenamos datos dummy para los campos no usados aquí
        fecha: new Date().toISOString().split("T")[0], 
        franja: "dia", 
      };
      // 2. Llamamos al servicio principal (M2)
      // Este servicio ya incluye la lógica de M1 (Geo) y M15 (Config)
      const result = await freightService.requestQuote(quoteData);
      setQuoteResult(result.total);
    } catch (err: any) {
      console.error("[PriceCalculator] Error:", err);
      setError(err.message || "No se pudo calcular la cotización.");
      setQuoteResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora Rápida de Precios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="origen">Origen</Label>
          <Input
            id="origen"
            value={formData.origen}
            onChange={(e) => handleInputChange("origen", e.target.value)}
            placeholder="Ciudad de origen"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destino">Destino</Label>
          <Input
            id="destino"
            value={formData.destino}
            onChange={(e) => handleInputChange("destino", e.target.value)}
            placeholder="Ciudad de destino"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
          <Select
            value={formData.tipoServicio}
            onValueChange={(value: ServiceType) => handleInputChange("tipoServicio", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mudanza_completa">Mudanza Completa</SelectItem>
              <SelectItem value="mini_mudanza">Mini Mudanza</SelectItem>
              <SelectItem value="flete_liviano">Flete Liviano</SelectItem>
              <SelectItem value="viaje_largo">Viaje Largo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pisosEscalera">Pisos/Escaleras</Label>
          <Input
            id="pisosEscalera"
            type="number"
            min="0"
            value={formData.pisosEscalera}
            onChange={(e) => handleInputChange("pisosEscalera", parseInt(e.target.value) || 0)}
            placeholder="Número de pisos con escaleras"
          />
        </div>

        <Button onClick={handleCalculate} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Calcular Precio"
          )}
        </Button>

        {error && (
          <p className="text-sm text-center font-medium text-destructive">
            {error}
          </p>
        )}

        {quoteResult !== null && !isLoading && !error && (
          <div className="text-center">
            <p className="text-lg">Precio Estimado:</p>
            <p className="text-4xl font-bold text-primary">
              ${quoteResult.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}