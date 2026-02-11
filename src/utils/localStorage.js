/**
 * Guardar en localStorage de forma segura
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
}

/**
 * Obtener de localStorage
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error leyendo de localStorage:', error);
    return defaultValue;
  }
}

/**
 * Eliminar de localStorage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
  }
}

/**
 * Limpiar todo localStorage
 */
export function clear() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
  }
}
