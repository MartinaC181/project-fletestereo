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
   * Notifica al cliente que debe pagar la seña
   */
  async notifyClientSeniaRequired(freightRequest: FreightRequest, linkPago: string): Promise<void> {
    try {
      const clientEmail = freightRequest.client?.email;
      if (!clientEmail) {
        console.warn('[NotificationService] ⚠️ Cliente no tiene email, saltando notificación');
        return;
      }

      const emailHtml = this.generateClientSeniaRequestEmail(freightRequest, linkPago);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'masdeu398@gmail.com',
        to: clientEmail,
        subject: `💰 Seña requerida para tu flete #${freightRequest.id.slice(0, 8)} - Fletestereo`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService] ✅ Email de seña enviado al cliente:', clientEmail);
    } catch (error) {
      console.error('[NotificationService] ❌ Error enviando email de seña al cliente:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }

  /**
   * Notifica al admin que la seña fue pagada
   */
  async notifyAdminSeniaPaid(freightRequest: FreightRequest, referenciaPago: string): Promise<void> {
    try {
      const emailHtml = this.generateAdminSeniaPaidEmail(freightRequest, referenciaPago);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'masdeu398@gmail.com',
        to: 'masdeu398@gmail.com', // Email del admin
        subject: `💰 Seña pagada - Flete #${freightRequest.id.slice(0, 8)}`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService] ✅ Email de seña pagada enviado al admin');
    } catch (error) {
      console.error('[NotificationService] ❌ Error enviando email de seña pagada al admin:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }

  /**
   * Notifica al cliente que el servicio está confirmado tras pago de seña
   */
  async notifyClientServiceConfirmedAfterSenia(freightRequest: FreightRequest): Promise<void> {
    try {
      const clientEmail = freightRequest.client?.email;
      if (!clientEmail) {
        console.warn('[NotificationService] ⚠️ Cliente no tiene email, saltando notificación');
        return;
      }

      const emailHtml = this.generateClientServiceConfirmedEmail(freightRequest);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'masdeu398@gmail.com',
        to: clientEmail,
        subject: `🎉 ¡Servicio confirmado! Seña recibida - Flete #${freightRequest.id.slice(0, 8)}`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService] ✅ Email de servicio confirmado enviado al cliente:', clientEmail);
    } catch (error) {
      console.error('[NotificationService] ❌ Error enviando email de servicio confirmado:', error);
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
              <strong>Origen:</strong> ${freightRequest.quote?.origen || 'N/A'}<br>
              <strong>Destino:</strong> ${freightRequest.quote?.destino || 'N/A'}<br>
              <strong>Fecha:</strong> ${freightRequest.quote?.fecha || 'N/A'}<br>
              <strong>Franja horaria:</strong> ${freightRequest.quote?.franja || 'N/A'}<br>
              <strong>Tipo de servicio:</strong> ${freightRequest.quote?.tipoServicio || 'N/A'}<br>
              ${(freightRequest.quote?.pisosEscalera || 0) > 0 ? `<strong>Pisos con escalera:</strong> ${freightRequest.quote?.pisosEscalera}<br>` : ''}
              ${freightRequest.quote?.notas ? `<strong>Notas:</strong> ${freightRequest.quote?.notas}<br>` : ''}
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
              <strong>Origen:</strong> ${freightRequest.quote?.origen || 'N/A'}<br>
              <strong>Destino:</strong> ${freightRequest.quote?.destino || 'N/A'}<br>
              <strong>Fecha:</strong> ${freightRequest.quote?.fecha || 'N/A'}<br>
              <strong>Franja horaria:</strong> ${freightRequest.quote?.franja || 'N/A'}<br>
              <strong>Tipo de servicio:</strong> ${freightRequest.quote?.tipoServicio || 'N/A'}
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
   * Genera el HTML del email solicitando seña al cliente
   */
  private generateClientSeniaRequestEmail(freightRequest: FreightRequest, linkPago: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Seña requerida</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f59e0b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #fffbeb; padding: 20px; border-radius: 0 0 8px 8px; }
          .detail { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
          .amount { font-size: 20px; font-weight: bold; color: #f59e0b; text-align: center; }
          .button { display: inline-block; padding: 15px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Seña Requerida</h1>
            <p>Solicitud #${freightRequest.id.slice(0, 8)}</p>
          </div>
          <div class="content">
            <p>¡Excelente! Tu solicitud de flete ha sido <strong>aceptada</strong>.</p>
            
            <p>Para confirmar el servicio, necesitamos que realices el pago de la seña:</p>

            <div class="detail">
              <div class="amount">Seña: $${freightRequest.montoSenia?.toLocaleString() || 'N/A'}</div>
            </div>

            <h2>Detalles del servicio:</h2>
            <div class="detail">
              <strong>Origen:</strong> ${freightRequest.quote?.origen || 'N/A'}<br>
              <strong>Destino:</strong> ${freightRequest.quote?.destino || 'N/A'}<br>
              <strong>Fecha:</strong> ${freightRequest.quote?.fecha || 'N/A'}<br>
              <strong>Total del servicio:</strong> $${freightRequest.calculatedQuote?.total?.toLocaleString() || 'N/A'}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkPago}" class="button">
                💳 Pagar Seña Ahora
              </a>
            </div>

            <p><strong>Importante:</strong></p>
            <ul>
              <li>Una vez pagada la seña, el servicio quedará 100% confirmado</li>
              <li>El saldo restante se paga al finalizar el servicio</li>
              <li>Si tienes alguna consulta, contáctanos por WhatsApp</li>
            </ul>

            <p>📱 WhatsApp: +54 9 3795170535</p>
            <p><em>¡Gracias por elegir Fletestereo!</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera el HTML del email notificando al admin que se pagó la seña
   */
  private generateAdminSeniaPaidEmail(freightRequest: FreightRequest, referenciaPago: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Seña Pagada</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f0fdf4; padding: 20px; border-radius: 0 0 8px 8px; }
          .detail { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
          .success { color: #10b981; font-weight: bold; font-size: 18px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Seña Pagada - Confirmación Pendiente</h1>
            <p>Flete #${freightRequest.id.slice(0, 8)}</p>
          </div>
          <div class="content">
            <div class="success">
              ¡El cliente ha pagado la seña! Necesita tu confirmación.
            </div>

            <h2>Información del pago:</h2>
            <div class="detail">
              <strong>Monto de seña:</strong> $${freightRequest.montoSenia?.toLocaleString() || 'N/A'}<br>
              <strong>Referencia:</strong> ${referenciaPago}<br>
              <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
            </div>

            <h2>Datos del cliente:</h2>
            <div class="detail">
              <strong>Nombre:</strong> ${freightRequest.client?.nombre} ${freightRequest.client?.apellido}<br>
              <strong>Teléfono:</strong> ${freightRequest.client?.telefono}<br>
              <strong>Email:</strong> ${freightRequest.client?.email}
            </div>

            <p><strong>Próximos pasos:</strong></p>
            <ol>
              <li>Verificar el pago en tu aplicación de billetera virtual</li>
              <li>Confirmar el servicio en el dashboard</li>
              <li>Se enviará automáticamente la confirmación final al cliente</li>
            </ol>

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
   * Genera el HTML del email de confirmación final del servicio
   */
  private generateClientServiceConfirmedEmail(freightRequest: FreightRequest): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Servicio Confirmado</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f0fdf4; padding: 20px; border-radius: 0 0 8px 8px; }
          .detail { margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px; }
          .success { color: #10b981; font-weight: bold; font-size: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Servicio Confirmado!</h1>
            <p>Solicitud #${freightRequest.id.slice(0, 8)}</p>
          </div>
          <div class="content">
            <div class="success">
              ¡Tu seña fue recibida y el servicio está 100% confirmado!
            </div>

            <h2>Resumen del servicio:</h2>
            <div class="detail">
              <strong>Origen:</strong> ${freightRequest.quote?.origen || 'N/A'}<br>
              <strong>Destino:</strong> ${freightRequest.quote?.destino || 'N/A'}<br>
              <strong>Fecha:</strong> ${freightRequest.quote?.fecha || 'N/A'}<br>
              <strong>Franja:</strong> ${freightRequest.quote?.franja || 'N/A'}
            </div>

            <h2>Información de pago:</h2>
            <div class="detail">
              <strong>Seña pagada:</strong> $${freightRequest.montoSenia?.toLocaleString() || 'N/A'}<br>
              <strong>Total del servicio:</strong> $${freightRequest.calculatedQuote?.total?.toLocaleString() || 'N/A'}<br>
              <strong>Saldo restante:</strong> $${((freightRequest.calculatedQuote?.total || 0) - (freightRequest.montoSenia || 0)).toLocaleString()}
            </div>

            <h2>¿Qué sigue ahora?</h2>
            <div class="detail">
              <ul>
                <li><strong>Nos pondremos en contacto</strong> para coordinar horario exacto</li>
                <li><strong>El día del servicio</strong> pagas el saldo restante</li>
                <li><strong>Tienes alguna consulta</strong> contáctanos por WhatsApp</li>
              </ul>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              📱 <strong>WhatsApp:</strong> +54 9 3795170535<br>
              ✉️ <strong>Email:</strong> masdeu398@gmail.com
            </p>

            <p><em>¡Gracias por confiar en Fletestereo! Estamos listos para tu mudanza.</em></p>
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