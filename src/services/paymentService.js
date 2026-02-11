import apiClient from '@/lib/axios';

export const paymentService = {
  /**
   * Crear preferencia de pago en MercadoPago
   * @param {string} orderId - ID de la orden
   * @returns {Promise} - Preferencia con init_point para redirigir al checkout
   */
  async createPayment(orderId) {
    const response = await apiClient.post('/payments', { orderId });
    return response.payment;
  },

  /**
   * Obtener información de un pago por ID de pago o ID de orden
   * @param {string} id - ID del pago o ID de la orden
   */
  async getPaymentById(id) {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  /**
   * Alias: Obtener pago por ID de orden (usa el mismo endpoint)
   * @param {string} orderId - ID de la orden
   */
  async getPaymentByOrder(orderId) {
    return this.getPaymentById(orderId);
  },

  /**
   * Verificar estado de un pago
   * @param {string} id - ID del pago o ID de la orden
   */
  async checkPaymentStatus(id) {
    const payment = await this.getPaymentById(id);
    return {
      status: payment.payment.status,
      mercadopagoStatus: payment.payment.mercadopago.status,
      isPaid: payment.payment.status === 'PAID',
      isPending: payment.payment.status === 'PENDING',
      isFailed: payment.payment.status === 'FAILED'
    };
  },
};