import apiClient from '../lib/axios';

export const shipmentService = {
  async getShipmentById(shipmentId) {
    return apiClient.get(`/shipments/${shipmentId}`);
  },

  async updateShipmentStatus(shipmentId, status, location, note) {
    return apiClient.put(`/shipments/${shipmentId}`, { status, location, note });
  },
};
