# 🔄 Migración de Context API a Zustand + Cart & Favorites

## 📋 Descripción

Este script migra tu proyecto de Next.js desde Context API (AuthContext, CartContext, UIContext) a **Zustand**, además de implementar **Cart** y **Favorites** como entidades completas tanto en el backend como en el frontend.

## 🎯 Lo que hace el script

### ✅ Backend
1. **Modelos Mongoose**:
   - `Cart.js` - Carrito de compras con items y snapshots
   - `Favorite.js` - Lista de favoritos del usuario

2. **Servicios Backend**:
   - `cartService.js` - Lógica de negocio del carrito
   - `favoriteService.js` - Lógica de negocio de favoritos

3. **Rutas API RESTful**:
   - `GET/POST/DELETE /api/cart` - Gestión del carrito
   - `PUT/DELETE /api/cart/:itemId` - Items individuales
   - `GET/POST/DELETE /api/favorites` - Gestión de favoritos
   - `GET/DELETE /api/favorites/:productId` - Productos favoritos

### ✅ Frontend
1. **Zustand Stores** (sin Context API):
   - `useAuthStore.js` - Autenticación y usuario
   - `useCartStore.js` - Estado del carrito
   - `useFavoritesStore.js` - Estado de favoritos
   - `useUIStore.js` - Estado de UI (modals, drawers, etc.)

2. **Servicios Frontend**:
   - `cart.service.js` - Llamadas API del carrito
   - `favorites.service.js` - Llamadas API de favoritos

3. **Hooks Personalizados**:
   - `useCart.js` - Lógica completa del carrito con sincronización
   - `useFavorites.js` - Lógica completa de favoritos con sincronización

4. **Páginas**:
   - `/carrito` - Página del carrito de compras
   - `/favoritos` - Página de productos favoritos

5. **Componentes**:
   - `FavoriteButton` - Botón de favorito con corazón
   - `CartButton` - Botón del carrito con contador
   - `AddToCartButton` - Botón para agregar al carrito

### 🗑️ Elimina
- `src/contexts/AuthContext.jsx`
- `src/contexts/CartContext.jsx`
- `src/contexts/UIContext.jsx`
- Todo el directorio `src/contexts/`

### ✨ Actualiza
- `src/providers.js` - Simplificado sin Context API

## 🚀 Instalación

### 1. Dar permisos de ejecución
```bash
chmod +x migrate-to-zustand-complete.sh
```

### 2. Ejecutar el script
```bash
bash migrate-to-zustand-complete.sh
```

### 3. Verificar instalación
El script instalará automáticamente:
- `zustand` - Estado global
- `sonner` - Notificaciones toast
- `lucide-react` - Iconos

## 📝 Uso de los Stores

### Auth Store
```javascript
import { useAuthStore } from '@/stores/useAuthStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Hola, {user.firstName}</p>
      ) : (
        <button onClick={() => login(userData, token)}>
          Iniciar Sesión
        </button>
      )}
    </div>
  );
}
```

### Cart Hook
```javascript
import { useCart } from '@/hooks/useCart';

function ProductCard({ product }) {
  const { addItem, totalItems, isLoading } = useCart();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button 
        onClick={() => addItem(product, 1)}
        disabled={isLoading}
      >
        Agregar al Carrito
      </button>
      <span>Items en carrito: {totalItems}</span>
    </div>
  );
}
```

### Favorites Hook
```javascript
import { useFavorites } from '@/hooks/useFavorites';

function ProductCard({ product }) {
  const { toggleProduct, isFavorite } = useFavorites();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => toggleProduct(product)}>
        {isFavorite(product._id) ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

### UI Store
```javascript
import { useUIStore } from '@/stores/useUIStore';

function Header() {
  const { 
    isCartDrawerOpen, 
    openCartDrawer, 
    closeCartDrawer 
  } = useUIStore();
  
  return (
    <>
      <button onClick={openCartDrawer}>Abrir Carrito</button>
      {isCartDrawerOpen && (
        <CartDrawer onClose={closeCartDrawer} />
      )}
    </>
  );
}
```

## 🔌 API Endpoints

### Cart Endpoints
```bash
# Obtener carrito
GET /api/cart
Authorization: Bearer <token>

# Agregar producto
POST /api/cart
Authorization: Bearer <token>
{
  "productId": "123",
  "quantity": 2,
  "characteristics": [
    { "key": "size", "label": "Talla", "value": "M" }
  ]
}

# Actualizar cantidad
PUT /api/cart/:itemId
Authorization: Bearer <token>
{ "quantity": 3 }

# Remover item
DELETE /api/cart/:itemId
Authorization: Bearer <token>

# Vaciar carrito
DELETE /api/cart
Authorization: Bearer <token>
```

### Favorites Endpoints
```bash
# Obtener favoritos
GET /api/favorites
Authorization: Bearer <token>

# Toggle producto (agregar/remover)
POST /api/favorites
Authorization: Bearer <token>
{ "productId": "123" }

# Verificar si es favorito
GET /api/favorites/:productId
Authorization: Bearer <token>

# Remover de favoritos
DELETE /api/favorites/:productId
Authorization: Bearer <token>

# Limpiar favoritos
DELETE /api/favorites
Authorization: Bearer <token>
```

## 🎨 Componentes Incluidos

### FavoriteButton
```javascript
import { FavoriteButton } from '@/components/product/FavoriteButton';

<FavoriteButton product={product} className="absolute top-2 right-2" />
```

### CartButton
```javascript
import { CartButton } from '@/components/cart/CartButton';

<CartButton /> // Muestra badge con cantidad de items
```

### AddToCartButton
```javascript
import { AddToCartButton } from '@/components/product/AddToCartButton';

<AddToCartButton 
  product={product}
  quantity={1}
  characteristics={[]}
  variant="primary" // primary | secondary | outline
/>
```

## 🔧 Configuración

### Variables de Entorno
Asegúrate de tener en tu `.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Persistencia
Los stores de Zustand usan `localStorage` para persistir:
- `auth-storage` - Autenticación
- `cart-storage` - Carrito
- `favorites-storage` - Favoritos

## 🔄 Sincronización

### Cart
- Se sincroniza automáticamente cuando el usuario inicia sesión
- Funciona localmente si no está autenticado
- Al hacer login, el carrito local se sincroniza con el servidor

### Favorites
- Se sincroniza automáticamente cuando el usuario inicia sesión
- Funciona localmente si no está autenticado
- Al hacer login, los favoritos locales se sincronizan con el servidor

## 📦 Estructura de Datos

### Cart Item
```javascript
{
  _id: "item-id",
  product: {
    _id: "product-id",
    name: "Nombre",
    slug: "slug",
    price: 1000,
    stock: 10,
    isActive: true
  },
  productSnapshot: {
    name: "Nombre",
    slug: "slug",
    price: 1000,
    primaryImage: "url"
  },
  quantity: 2,
  selectedCharacteristics: [
    { key: "size", label: "Talla", value: "M" }
  ],
  addedAt: "2024-01-01T00:00:00.000Z"
}
```

### Favorite
```javascript
{
  _id: "favorite-id",
  user: "user-id",
  products: [
    {
      _id: "product-id",
      name: "Nombre",
      slug: "slug",
      price: 1000,
      compareAtPrice: 1500,
      stock: 10,
      isActive: true,
      images: [
        { url: "image-url", isPrimary: true }
      ]
    }
  ],
  lastModified: "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

Los stores de Zustand son fáciles de testear:

```javascript
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/stores/useCartStore';

test('should add item to cart', () => {
  const { result } = renderHook(() => useCartStore());
  
  act(() => {
    result.current.addItem({
      product: { _id: '1', name: 'Test', price: 100 },
      quantity: 1
    });
  });
  
  expect(result.current.totalItems).toBe(1);
});
```

## 🚨 Troubleshooting

### Error: "localStorage is not defined"
- Zustand con persist solo funciona en el cliente
- Asegúrate de usar `"use client"` en tus componentes

### Error: "Cannot read property 'user' of undefined"
- El store puede no estar inicializado
- Usa valores por defecto: `const user = useAuthStore(state => state.user) ?? null`

### Items del carrito no se sincronizan
- Verifica que el token JWT esté en localStorage
- Revisa que los headers de autorización se estén enviando
- Comprueba la conexión a MongoDB

## 📚 Recursos

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [Sonner Toast](https://sonner.emilkowal.ski/)
- [Lucide Icons](https://lucide.dev/)

## 🎉 Beneficios de Zustand vs Context

✅ **Más simple** - Sin providers anidados
✅ **Mejor performance** - No re-renderiza componentes innecesariamente
✅ **TypeScript nativo** - Excelente tipado
✅ **DevTools** - Extensión de navegador disponible
✅ **Menos boilerplate** - Menos código que escribir
✅ **Middleware incluido** - persist, devtools, etc.

## 🤝 Contribuir

Si encuentras algún bug o tienes sugerencias, por favor crea un issue.

## 📄 Licencia

MIT