/**
 * Wrapper de MercadoPago SDK
 * Los services NO importan mercadopago directamente, solo este módulo.
 */

// TODO: Instalar SDK → npm install mercadopago
// import MercadoPago from 'mercadopago';

// const mp = new MercadoPago(process.env.MERCADOPAGO_ACCESS_TOKEN);

/**
 * Crear preferencia de pago (Checkout Pro)
 */
export async function createPreference(preferenceData) {
  // const response = await mp.preferences.create(preferenceData);
  // return response.body;
  throw new Error('MercadoPago no configurado aún');
}

/**
 * Obtener datos completos de un pago por ID
 */
export async function getPayment(paymentId) {
  // const response = await mp.payment.get(paymentId);
  // return response.body;
  throw new Error('MercadoPago no configurado aún');
}

/**
 * Validar notificación webhook (firma HMAC)
 */
export function validateWebhook(signature, body, secret) {
  // Implementar validación HMAC según docs de MP
  // https://developers.mercadolibre.com/developers/es/docs/mercado-pago/developer-tools/sdk/server-side/nodejs#validar-notificaciones
  console.warn('Validación webhook pendiente de implementar');
  return true;
}
