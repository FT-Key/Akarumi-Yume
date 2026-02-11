export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pendiente',
  PAYMENT_PENDING: 'Esperando pago',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  READY_FOR_PICKUP: 'Listo para retiro',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  RETURNED: 'RETURNED',
};

export const SHIPMENT_STATUS_LABELS = {
  PENDING: 'Pendiente',
  SHIPPED: 'Despachado',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado',
  FAILED: 'Fallido',
  RETURNED: 'Devuelto',
};

export const DELIVERY_TYPES = {
  PICKUP: 'PICKUP',
  DELIVERY: 'DELIVERY',
};

export const PROVINCES = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
  "Ciudad Autónoma de Buenos Aires"
]

export const PAYMENT_STATUS = {
  PENDING:   "PENDING",
  PAID:      "PAID",
  FAILED:    "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED:  "REFUNDED",
};