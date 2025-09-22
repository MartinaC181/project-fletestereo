import { eventBus, createEvent } from '@/core/events';
import type { PaymentEvent } from '@/core/events/domain-events';

export interface PaymentData {
  freightRequestId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  clientId: string;
}

export interface PaymentResult {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  providerId?: string;
  error?: string;
}

/**
 * Servicio de pagos que utiliza el Event Bus para notificar
 * sobre cambios en el estado de los pagos
 */
export class PaymentService {

  /**
   * Inicia un proceso de pago
   */
  async initiatePayment(paymentData: PaymentData): Promise<PaymentResult> {
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Emitir evento de inicio de pago
    const paymentInitiatedEvent = createEvent<Omit<PaymentEvent, 'id' | 'timestamp'>>({
      type: 'payment.initiated',
      payload: {
        paymentId,
        freightRequestId: paymentData.freightRequestId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        status: 'pending'
      }
    });

    await eventBus.emit(paymentInitiatedEvent);

    // Simular procesamiento de pago
    const result = await this.processPayment(paymentId, paymentData);

    // Emitir evento de resultado
    const resultEvent = createEvent<Omit<PaymentEvent, 'id' | 'timestamp'>>({
      type: result.status === 'completed' ? 'payment.completed' : 'payment.failed',
      payload: {
        paymentId,
        freightRequestId: paymentData.freightRequestId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        status: result.status,
        providerId: result.providerId,
        error: result.error,
        processedAt: new Date()
      }
    });

    await eventBus.emit(resultEvent);

    return result;
  }

  /**
   * Simula el procesamiento del pago con una pasarela externa
   */
  private async processPayment(paymentId: string, paymentData: PaymentData): Promise<PaymentResult> {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular éxito/fallo aleatorio (90% éxito)
    const success = Math.random() > 0.1;

    if (success) {
      return {
        paymentId,
        status: 'completed',
        providerId: `provider_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        paymentId,
        status: 'failed',
        error: 'Fondos insuficientes o tarjeta rechazada'
      };
    }
  }

  /**
   * Procesa un reembolso
   */
  async refundPayment(paymentId: string, freightRequestId: string, amount: number): Promise<void> {
    const refundEvent = createEvent<Omit<PaymentEvent, 'id' | 'timestamp'>>({
      type: 'payment.refunded',
      payload: {
        paymentId,
        freightRequestId,
        amount,
        currency: 'CLP',
        paymentMethod: 'refund',
        status: 'refunded',
        processedAt: new Date()
      }
    });

    await eventBus.emit(refundEvent);
  }

  /**
   * Integra una nueva pasarela de pago
   * Ejemplo de cómo el Event Bus facilita la extensibilidad
   */
  integrateNewPaymentGateway(gatewayName: string): void {
    // Suscribirse a eventos de pago para procesarlos con la nueva pasarela
    eventBus.subscribe('payment.initiated', async (event: PaymentEvent) => {
      console.log(`[${gatewayName}] Procesando pago iniciado:`, event.payload);
      // Lógica específica de la pasarela...
    });

    console.log(`[PaymentService] Nueva pasarela ${gatewayName} integrada al Event Bus`);
  }
}

// Instancia global del servicio de pagos
export const paymentService = new PaymentService();
