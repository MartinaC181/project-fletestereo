"use client";

import { useEffect, useState } from "react";
import { configService } from "@/src/modules/config/ConfigService";
import type { PricingRules } from "@/src/modules/config/config.types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useToast } from "@/src/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

type FormState = PricingRules | null;

export function ConfigForm() {
  const [formData, setFormData] = useState<FormState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadRules() {
      try {
        setIsLoading(true);
        const rules = await configService.getPricingRules();
        setFormData(rules);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error al cargar las reglas.");
        toast({
          title: "Error al Cargar",
          description: err.message || "No se pudieron cargar las tarifas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadRules();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, [name]: Number(value) || 0 } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      await configService.savePricingRules(formData);
      toast({
        title: "¡Guardado!",
        description: "Las tarifas y reglas se actualizaron correctamente.",
      });
    } catch (err: any) {
      setError(err.message || "Error al guardar.");
      toast({
        title: "Error al Guardar",
        description: err.message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <ConfigFormSkeleton />;
  }

  if (error || !formData) {
    return (
      <div className="text-destructive">
        Error al cargar la configuración: {error}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- SECCIÓN VARIABLES DINÁMICAS --- */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-lg font-medium">Reglas Principales</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InputGroup
            label="Precio Mínimo (ARS)"
            name="PRECIO_MINIMO_FLETE"
            value={formData.PRECIO_MINIMO_FLETE}
            onChange={handleChange}
          />
          <InputGroup
            label="Precio Combustible (ARS por KM)"
            name="PRECIO_COMBUSTIBLE_KM"
            value={formData.PRECIO_COMBUSTIBLE_KM}
            onChange={handleChange}
          />
          <InputGroup
            label="Extra por Escalera (ARS por Piso)"
            name="EXTRA_PISO_ESCALERA"
            value={formData.EXTRA_PISO_ESCALERA}
            onChange={handleChange}
          />
          <InputGroup
            label="% Seña Interurbana (Ej: 50)"
            name="PORCENTAJE_SENIA_LARGA"
            value={formData.PORCENTAJE_SENIA_LARGA}
            onChange={handleChange}
          />
          <InputGroup
            label="Límite KM Recorrido Corto"
            name="LIMITE_KM_CORTA"
            value={formData.LIMITE_KM_CORTA}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
        {isSaving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Guardar Cambios
      </Button>
    </form>
  );
}

// Componente auxiliar para el formulario
function InputGroup({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof PricingRules;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        min="0"
      />
    </div>
  );
}

// Componente auxiliar para el estado de carga
function ConfigFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border p-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
      <div className="space-y-4 rounded-lg border p-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-36" />
    </div>
  );
}