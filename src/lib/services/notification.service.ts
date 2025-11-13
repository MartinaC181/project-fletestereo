import nodemailer from 'nodemailer';
import { FreightRequest } from '@/src/core/events/domain-events';

/**
 * Servicio de notificaciones por email para el sistema de fletes
 */
class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar nodemailer con configuración más específica para Gmail
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    console.log('[NotificationService] Configurado con email:', process.env.EMAIL_USER);
  }

  /**
   * Notifica al admin cuando un cliente confirma un flete
   */
  async notifyAdminNewFreight(freightRequest: FreightRequest): Promise<void> {
    try {
      const emailHtml = this.generateAdminNotificationEmail(freightRequest);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'masdeu398@gmail.com',
        to: 'masdeu398@gmail.com', // Email del admin
        subject: `🚛 Nueva solicitud de flete #${freightRequest.id.slice(0, 8)}`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService] ✅ Email enviado al admin para solicitud:', freightRequest.id);
    } catch (error) {
      console.error('[NotificationService] ❌ Error enviando email al admin:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }

  /**
   * Notifica al cliente que su flete fue confirmado
   */
  async notifyClientFreightConfirmed(freightRequest: FreightRequest): Promise<void> {
    try {
      const clientEmail = freightRequest.client?.email;
      if (!clientEmail) {
        console.warn('[NotificationService] ⚠️ Cliente no tiene email, saltando notificación');
        return;
      }

      const emailHtml = this.generateClientConfirmationEmail(freightRequest);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'masdeu398@gmail.com',
        to: clientEmail,
        subject: `✅ ¡Tu flete ha sido confirmado! - Fletestereo`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService] ✅ Email de confirmación enviado al cliente:', clientEmail);
    } catch (error) {
      console.error('[NotificationService] ❌ Error enviando email al cliente:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }

  /**
   * Notifica al cliente que su flete fue rechazado
   */
  async notifyClientFreightRejected(freightRequest: FreightRequest, reason: string): Promise<void> {
    try {
      const clientEmail = freightRequest.client?.email;
      if (!clientEmail) {
        console.warn('[NotificationService] ⚠️ Cliente no tiene email, saltando notificación');
        return;
      }

      const emailHtml = this.generateClientRejectionEmail(freightRequest, reason);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'masdeu398@gmail.com',
        to: clientEmail,
        subject: `❌ Información sobre tu solicitud de flete - Fletestereo`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService] ✅ Email de rechazo enviado al cliente:', clientEmail);
    } catch (error) {
      console.error('[NotificationService] ❌ Error enviando email de rechazo al cliente:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }

  /**
   * Genera el HTML del email para el admin
   */
  private generateAdminNotificationEmail(freightRequest: FreightRequest): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva solicitud de flete</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
          .detail { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
          .total { font-size: 18px; font-weight: bold; color: #2563eb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚛 Nueva Solicitud de Flete</h1>
            <p>Solicitud #${freightRequest.id.slice(0, 8)}</p>
          </div>
          <div class="content">
            <h2>Datos del Cliente:</h2>
            <div class="detail">
              <strong>Nombre:</strong> ${freightRequest.client?.nombre || 'N/A'} ${freightRequest.client?.apellido || ''}<br>
              <strong>Teléfono:</strong> ${freightRequest.client?.telefono || 'N/A'}<br>
              <strong>Email:</strong> ${freightRequest.client?.email || 'N/A'}
            </div>

            <h2>Detalles del Flete:</h2>
            <div class="detail">
              <strong>Origen:</strong> ${freightRequest.origen}<br>
              <strong>Destino:</strong> ${freightRequest.destino}<br>
              <strong>Fecha:</strong> ${freightRequest.fecha}<br>
              <strong>Franja horaria:</strong> ${freightRequest.franja}<br>
              <strong>Tipo de servicio:</strong> ${freightRequest.tipoServicio}<br>
              ${freightRequest.pisosEscalera > 0 ? `<strong>Pisos con escalera:</strong> ${freightRequest.pisosEscalera}<br>` : ''}
              ${freightRequest.notas ? `<strong>Notas:</strong> ${freightRequest.notas}<br>` : ''}
            </div>

            <h2>Cotización:</h2>
            <div class="detail">
              <div class="total">Total: $${freightRequest.calculatedQuote?.total?.toLocaleString() || 'N/A'}</div>
            </div>

            <p style="margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" class="button">
                Ver en Dashboard
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera el HTML del email de confirmación para el cliente
   */
  private generateClientConfirmationEmail(freightRequest: FreightRequest): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Flete Confirmado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f0fdf4; padding: 20px; border-radius: 0 0 8px 8px; }
          .detail { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
          .success { color: #16a34a; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ ¡Tu flete ha sido confirmado!</h1>
            <p>Solicitud #${freightRequest.id.slice(0, 8)}</p>
          </div>
          <div class="content">
            <div class="success">
              ¡Excelente noticia! Hemos confirmado tu solicitud de flete.
            </div>

            <h2>Detalles del servicio:</h2>
            <div class="detail">
              <strong>Origen:</strong> ${freightRequest.origen}<br>
              <strong>Destino:</strong> ${freightRequest.destino}<br>
              <strong>Fecha:</strong> ${freightRequest.fecha}<br>
              <strong>Franja horaria:</strong> ${freightRequest.franja}<br>
              <strong>Tipo de servicio:</strong> ${freightRequest.tipoServicio}
            </div>

            <h2>Próximos pasos:</h2>
            <div class="detail">
              <ul>
                <li>Nos pondremos en contacto contigo al ${freightRequest.client?.telefono} para coordinar los detalles finales</li>
                <li>Confirmaremos la hora exacta de llegada el día anterior al servicio</li>
                <li>Asegurate de tener todo listo para el día programado</li>
              </ul>
            </div>

            <p><strong>Total del servicio:</strong> $${freightRequest.calculatedQuote?.total?.toLocaleString() || 'N/A'}</p>

            <p>Si tienes alguna consulta, no dudes en contactarnos:</p>
            <ul>
              <li>📱 WhatsApp: +54 9 3795170535</li>
              <li>✉️ Email: masdeu398@gmail.com</li>
            </ul>

            <p><em>¡Gracias por confiar en Fletestereo!</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera el HTML del email de rechazo para el cliente
   */
  private generateClientRejectionEmail(freightRequest: FreightRequest, reason: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Información sobre tu solicitud</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #fef2f2; padding: 20px; border-radius: 0 0 8px 8px; }
          .detail { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Información sobre tu solicitud</h1>
            <p>Solicitud #${freightRequest.id.slice(0, 8)}</p>
          </div>
          <div class="content">
            <p>Lamentamos informarte que no podemos procesar tu solicitud de flete en este momento.</p>

            <h2>Motivo:</h2>
            <div class="detail">
              ${reason}
            </div>

            <h2>¿Qué puedes hacer?</h2>
            <div class="detail">
              <ul>
                <li>Contactanos directamente para explorar alternativas</li>
                <li>Modifica algunos detalles de tu solicitud y vuelve a intentarlo</li>
                <li>Consulta sobre disponibilidad para otras fechas</li>
              </ul>
            </div>

            <p><strong>Contacto directo:</strong></p>
            <ul>
              <li>📱 WhatsApp: +54 9 3795170535</li>
              <li>✉️ Email: masdeu398@gmail.com</li>
            </ul>

            <p><em>¡Gracias por considerar Fletestereo!</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Instancia singleton del servicio
export const notificationService = new NotificationService();