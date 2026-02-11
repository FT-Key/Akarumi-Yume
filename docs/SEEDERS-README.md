# 🌱 Seeders E-Commerce

Seeders profesionales para poblar la base de datos con datos de prueba realistas.

## 📦 Contenido

### 1. **seed-users.js** - Usuarios y Direcciones
- 10 usuarios (1 admin + 9 usuarios regulares)
- 15 direcciones distribuidas entre usuarios
- Todas las contraseñas: `Password123!` (excepto admin: `Admin123!`)
- Direcciones validadas con coordenadas de Google Maps

### 2. **seed-products.js** - Productos y Categorías
- 14 categorías jerárquicas (4 padres, 10 hijas)
- 15 productos diversos con stock
- 20+ imágenes de productos (Unsplash)
- 70+ características polimórficas (colores, tallas, specs)

## 🚀 Instalación

### 1. Copiar seeders a tu proyecto

```bash
# Crear directorio de seeders
mkdir -p src/seeders

# Copiar archivos
cp seed-users.js src/seeders/
cp seed-products.js src/seeders/
cp run-seeders.sh ./
```

### 2. Dar permisos de ejecución

```bash
chmod +x run-seeders.sh
```

### 3. Configurar MongoDB

Asegúrate de tener `MONGODB_URI` en tu `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

## 🎯 Uso

### Opción 1: Script interactivo (recomendado)

```bash
./run-seeders.sh
```

Verás un menú:
```
1) 👥 Usuarios y Direcciones
2) 🛍️  Productos y Categorías
3) 🔄 Ambos (usuarios + productos)
4) ❌ Salir
```

### Opción 2: Línea de comandos

```bash
# Solo usuarios
./run-seeders.sh users

# Solo productos
./run-seeders.sh products

# Ambos seeders
./run-seeders.sh all
```

### Opción 3: Ejecutar directamente con Node

```bash
# Usuarios
node src/seeders/seed-users.js

# Productos
node src/seeders/seed-products.js
```

## 👥 Usuarios Creados

### Admin
```
Email:    admin@ecommerce.com
Password: Admin123!
Role:     ADMIN
DNI:      20123456
```

### Usuarios Regulares (ejemplos)
```
Email:    maria.gonzalez@gmail.com
Password: Password123!
DNI:      30456789
Direcciones: 2 (Casa + Oficina)

Email:    juan.perez@hotmail.com
Password: Password123!
DNI:      28765432
Direcciones: 1 (Casa en Yerba Buena)

Email:    ana.martinez@yahoo.com
Password: Password123!
DNI:      35234567
Direcciones: 2 (Casa + Casa de padres)
```

**Todos los usuarios regulares** tienen la misma contraseña: `Password123!`

## 🛍️ Productos Creados

### Categorías Padre
1. **Ropa** - Remeras, Pantalones, Buzos
2. **Electrónica** - Celulares, Auriculares
3. **Hogar** - Decoración
4. **Deportes** - Zapatillas

### Productos Destacados

#### Ropa
- Remera Básica Negra ($5,000) - Stock: 50
- Remera Oversize Blanca ($6,500) - Stock: 35
- Jean Clásico Azul ($15,000) - Stock: 40
- Buzo Canguro Gris ($18,000) - Stock: 45

#### Electrónica
- Smartphone Pro Max 256GB ($450,000) - Stock: 15
- Smartphone Mid 128GB ($180,000) - Stock: 28
- Auriculares Inalámbricos Premium ($35,000) - Stock: 22

#### Deportes
- Zapatillas Running Pro ($32,000) - Stock: 30
- Zapatillas Urbanas Blancas ($25,000) - Stock: 42

## 📊 Estadísticas

### Usuarios
```
Total:        10 usuarios
- Admin:      1
- Usuarios:   9
Direcciones:  15 direcciones
```

### Productos
```
Total:           15 productos
Categorías:      14 (4 padre + 10 hijas)
Imágenes:        20+ imágenes
Características: 70+ características
```

## 🎨 Características de Productos

Los productos incluyen características polimórficas:

### Ropa
- Color (color)
- Tallas (array: XS, S, M, L, XL, XXL)
- Material (text)
- Corte (text: Regular, Oversize, Slim)
- Lavable en lavarropas (boolean)

### Electrónica
- Almacenamiento (number + unit: GB)
- RAM (number + unit: GB)
- Pantalla (text)
- Cámara (number + unit: MP)
- Batería (number + unit: mAh)
- Color (color)
- 5G compatible (boolean)

### Auriculares
- Conectividad (text: Bluetooth 5.0/5.2)
- Cancelación de ruido (boolean)
- Batería (number + unit: hs)
- Inalámbrico (boolean)
- Resistente al agua (boolean)

### Zapatillas
- Tallas (array: 36-44)
- Material (text)
- Amortiguación (text: Alta, Media, Baja)
- Género (text: Unisex, Hombre, Mujer)

## ⚙️ Opciones Avanzadas

### Limpiar base de datos antes de seedear

Los seeders **limpian automáticamente** las colecciones antes de insertar datos:

```javascript
// seed-users.js limpia:
await User.deleteMany({});
await Address.deleteMany({});

// seed-products.js limpia:
await Product.deleteMany({});
await Category.deleteMany({});
await ProductImage.deleteMany({});
await ProductCharacteristic.deleteMany({});
```

### Modificar datos

Puedes editar los archivos para personalizar:

**seed-users.js:**
```javascript
const users = [
  {
    firstName: 'Tu',
    lastName: 'Nombre',
    email: 'tu@email.com',
    password: 'TuPassword123!',
    // ...
  }
];
```

**seed-products.js:**
```javascript
const products = [
  {
    name: 'Tu Producto',
    price: 10000,
    stock: 100,
    // ...
  }
];
```

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB esté corriendo
mongosh

# O si usas Docker:
docker ps | grep mongo
```

### Error: "MONGODB_URI is not defined"
```bash
# Verificar .env
cat .env | grep MONGODB_URI

# Debe tener:
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### Error: "Module not found: models/index.js"
```bash
# Verificar que los modelos existan
ls src/models/

# Deben existir:
# User.js, Address.js, Category.js, Product.js, etc.
```

### Seeders no ejecutan
```bash
# Verificar Node.js
node --version

# Debe ser >= 18.x

# Verificar permisos
chmod +x run-seeders.sh
```

## 📝 Notas Importantes

### Imágenes
- Las imágenes usan URLs de **Unsplash**
- Son imágenes reales de alta calidad
- No se suben a Firebase automáticamente
- El `storagePath` es generado pero no usado

### Passwords
- Todas las contraseñas se hashean con `bcryptjs`
- El modelo `User` tiene un pre-save hook que hashea automáticamente
- Las contraseñas en texto plano nunca se guardan en la DB

### DNI
- Los DNI son ficticios pero válidos (7-8 dígitos)
- Formatos reales argentinos
- No usar en producción

### Direcciones
- Las coordenadas son reales de Tucumán, Argentina
- Las direcciones están marcadas como `isValidated: true`
- Los `googlePlaceId` son ficticios (en producción se obtienen de Google Maps API)

### Slugs
- Los slugs se generan automáticamente desde el `name`
- El modelo tiene un pre-save hook que usa la función `slugify`
- Son únicos y optimizados para SEO

## 🚀 Siguiente Paso

Después de ejecutar los seeders:

1. **Iniciar la aplicación:**
```bash
npm run dev
```

2. **Probar login:**
```
URL: http://localhost:3000/iniciar-sesion
Email: admin@ecommerce.com
Password: Admin123!
```

3. **Ver productos:**
```
URL: http://localhost:3000/productos
```

4. **Panel admin:**
```
URL: http://localhost:3000/admin
(solo accesible con rol ADMIN)
```

## 🎯 Testing API

### Obtener productos
```bash
curl http://localhost:3000/api/products
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ecommerce.com",
    "password": "Admin123!"
  }'
```

### Obtener perfil (requiere token)
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📚 Recursos

- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Unsplash](https://unsplash.com/) - Imágenes usadas

## 🤝 Contribuir

Si encuentras algún error o tienes sugerencias:

1. Reporta el issue
2. Propone mejoras
3. Agrega más productos de ejemplo

## 📄 Licencia

MIT

---

¡Feliz seeding! 🌱
