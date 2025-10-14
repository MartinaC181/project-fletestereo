import { eventBus } from '@/core/events';
import type { PaymentEvent } from '@/core/events/domain-events';

/**
 * Ejemplo de cómo integrar una nueva pasarela de pago al sistema
 * sin modificar el código existente, solo suscribiéndose al Event Bus
 */
export class MercadoPagoGateway {
  private isInitialized = false;

  initialize(): void {
    if (this.isInitialized) return;

    // Suscribirse a eventos de pago para procesarlos con MercadoPago
    eventBus.subscribe('payment.initiated', this.handlePaymentInitiated.bind(this));
    
    this.isInitialized = true;
    console.log('[MercadoPagoGateway] Pasarela MercadoPago integrada al Event Bus');
  }

  private async handlePaymentInitiated(event: PaymentEvent): Promise<void> {
    // Solo procesar si el método de pago es MercadoPago
    if (event.payload.paymentMethod !== 'mercadopago') {
      return;
    }

    console.log('[MercadoPagoGateway] Procesando pago con MercadoPago:', event.payload);

    try {
      // Aquí iría la lógica específica de MercadoPago
      const mercadoPagoResult = await this.processMercadoPagoPayment(event.payload);
      
      // El resultado se maneja automáticamente por el PaymentService
      // que emitirá los eventos payment.completed o payment.failed
      
    } catch (error) {
      console.error('[MercadoPagoGateway] Error procesando pago:', error);
    }
  }

  private async processMercadoPagoPayment(paymentData: any): Promise<any> {
    // Simulación de integración con MercadoPago API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `mp_${Date.now()}`
        });
      }, 2000);
    });
  }

  destroy(): void {
    eventBus.unsubscribeAll('payment.initiated');
    this.isInitialized = false;
    console.log('[MercadoPagoGateway] Pasarela MercadoPago desconectada');
  }
}

/**
 * Ejemplo de otra pasarela de pago
 */
export class PayPalGateway {
  private isInitialized = false;

  initialize(): void {
    if (this.isInitialized) return;

    eventBus.subscribe('payment.initiated', this.handlePaymentInitiated.bind(this));
    
    // También escuchar eventos de reembolso
    eventBus.subscribe('payment.refunded', this.handleRefund.bind(this));
    
    this.isInitialized = true;
    console.log('[PayPalGateway] Pasarela PayPal integrada al Event Bus');
  }

  private async handlePaymentInitiated(event: PaymentEvent): Promise<void> {
    if (event.payload.paymentMethod !== 'paypal') {
      return;
    }

    console.log('[PayPalGateway] Procesando pago con PayPal:', event.payload);
    
    // Lógica específica de PayPal...
  }

  private async handleRefund(event: PaymentEvent): Promise<void> {
    console.log('[PayPalGateway] Procesando reembolso:', event.payload);
    
    // Lógica de reembolso específica de PayPal...
  }

  destroy(): void {
    eventBus.unsubscribeAll('payment.initiated');
    eventBus.unsubscribeAll('payment.refunded');
    this.isInitialized = false;
    console.log('[PayPalGateway] Pasarela PayPal desconectada');
  }
}

// Ejemplo de uso: estas pasarelas se pueden inicializar en cualquier momento
// sin afectar el resto del sistema
export const mercadoPagoGateway = new MercadoPagoGateway();
export const payPalGateway = new PayPalGateway();
