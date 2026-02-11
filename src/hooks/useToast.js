import { useUIStore } from '@/stores/useUIStore';

export const useToast = () => {
  const { showNotification } = useUIStore();

  return {
    success: (message) => showNotification({ message, type: 'success' }),
    error: (message) => showNotification({ message, type: 'error' }),
    info: (message) => showNotification({ message, type: 'info' }),
    warning: (message) => showNotification({ message, type: 'warning' }),
  };
};

export default useToast;
