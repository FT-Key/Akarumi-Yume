import { useState } from 'react';

/**
 * Hook para manejar la suscripción al newsletter
 * 
 * @returns {Object} { email, setEmail, handleSubmit, isSubmitting }
 */
export const useNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Aquí puedes integrar con tu API
      // await apiClient.post('/newsletter', { email });
      
      alert(`¡Suscripción exitosa para ${email}!`);
      setEmail('');
    } catch (error) {
      console.error('Error al suscribir:', error);
      alert('Error al suscribirse. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    handleSubmit,
    isSubmitting,
  };
};