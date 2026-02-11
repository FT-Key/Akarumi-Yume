'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/stores';
import { Sparkles, AlertCircle } from 'lucide-react';
import { addressService } from '@/services/addressService';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { deliveryTypeService } from '@/services/deliveryTypeService';

// Componentes del checkout
import ProgressSteps from '@/components/checkout/ProgressSteps';
import AddressStep from '@/components/checkout/AddressStep';
import OrderSummaryStep from '@/components/checkout/OrderSummaryStep';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';

const CheckoutPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, subtotal, clearCart } = useCartStore();

  // Estado general
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Estado de direcciones
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    alias: '',
    street: '',
    streetNumber: '',
    floor: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Argentina',
    reference: '',
    isDefault: false
  });

  // Estado de tipos de entrega
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);

  // Verificar autenticación y carrito
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/iniciar-sesion?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/productos');
      return;
    }

    loadInitialData();
  }, [isAuthenticated, items, router]);

  // Cargar datos iniciales
  const loadInitialData = async () => {
    await Promise.all([
      loadAddresses(),
      loadDeliveryTypes()
    ]);
  };

  // Cargar direcciones del usuario
  const loadAddresses = async () => {
    try {
      const response = await addressService.getAddresses(user.id);
      setAddresses(response.data || []);

      const defaultAddr = (response.data || []).find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
      setError('Error al cargar direcciones');
    }
  };

  // Cargar tipos de entrega
  const loadDeliveryTypes = async () => {
    try {
      const response = await deliveryTypeService.getDeliveryTypes({ active: true });
      const types = response?.data || [];
      setDeliveryTypes(types);

      // Seleccionar DELIVERY por defecto, o el primero disponible
      const defaultType = types.find(dt => dt.type === 'DELIVERY') || types[0];
      if (defaultType) {
        setSelectedDeliveryType(defaultType._id);
      }
    } catch (err) {
      console.error('Error al cargar tipos de entrega:', err);
      setError('Error al cargar tipos de entrega');
    }
  };

  // Crear nueva dirección
  const handleCreateAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await addressService.createAddress({
        ...newAddress,
        user: user.id
      });

      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data);
      setShowNewAddressForm(false);

      // Reset form
      setNewAddress({
        alias: '',
        street: '',
        streetNumber: '',
        floor: '',
        apartment: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Argentina',
        reference: '',
        isDefault: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear dirección');
    } finally {
      setLoading(false);
    }
  };

  // Crear orden y procesar pago
  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      setError('Selecciona una dirección de envío');
      return;
    }

    if (!selectedDeliveryType) {
      setError('Selecciona un tipo de entrega');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Crear orden
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id || item.product,
          quantity: item.quantity,
        })),
        shippingAddress: selectedAddress._id,
        deliveryType: selectedDeliveryType,
        customerNotes: ''
      };

      const orderResponse = await orderService.createOrder(orderData);
      console.log("orderResponse: ", orderResponse)
      const order = orderResponse.data;

      // 2. Crear preferencia de pago
      const paymentResponse = await paymentService.createPayment(order._id);
      console.log("PaymentResponse: ", paymentResponse)
      const payment = paymentResponse;

      // 3. Limpiar carrito
      clearCart();

      // 4. Redirigir a MercadoPago
      const checkoutUrl = process.env.NODE_ENV === 'development'
        ? payment.sandboxInitPoint
        : payment.initPoint;

      window.location.href = checkoutUrl;

    } catch (err) {
      console.error('Error al crear orden:', err);
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Error al procesar la orden');
      setLoading(false);
    }
  };

  // Calcular costos
  const selectedDeliveryTypeData = deliveryTypes.find(dt => dt._id === selectedDeliveryType);
  const shippingCost = selectedDeliveryTypeData?.price || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      {/* Gradient Mesh de fondo */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-purple-500/30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-pink-500/20" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Sparkles className="text-purple-400" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Finalizar Compra
          </h1>
          <p className="text-gray-400 text-lg">
            Estás a un paso de conseguir tus productos favoritos
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={step} />

        {/* Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Dirección */}
            {step === 1 && (
              <AddressStep
                addresses={addresses}
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
                showNewAddressForm={showNewAddressForm}
                onToggleForm={() => setShowNewAddressForm(!showNewAddressForm)}
                newAddress={newAddress}
                onAddressChange={setNewAddress}
                onCreateAddress={handleCreateAddress}
                loading={loading}
                onContinue={() => setStep(2)}
              />
            )}

            {/* Step 2: Resumen de la orden */}
            {step === 2 && (
              <OrderSummaryStep
                items={items}
                onBack={() => setStep(1)}
                onContinue={handleCreateOrder}
                loading={loading}
                deliveryTypes={deliveryTypes}
                selectedDeliveryType={selectedDeliveryType}
                onSelectDeliveryType={setSelectedDeliveryType}
              />
            )}
          </div>

          {/* Sidebar - Resumen del pedido */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              deliveryTypes={deliveryTypes}
              selectedDeliveryType={selectedDeliveryType}
              onSelectDeliveryType={setSelectedDeliveryType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;