import { useState } from "react";

const architecture = {
  layers: [
    {
      id: "routes",
      label: "🛣️ Routes (API Layer)",
      color: "#e2e8f0",
      accent: "#64748b",
      description:
        "Capa más delgada del sistema. Solo recibe la request HTTP, la pasa al controller correspondiente y retorna la response. No tiene lógica de negocio.",
      rule: "Una ruta = un archivo. El método HTTP define la acción (GET, POST, PUT, DELETE). Nada más.",
      files: [
        {
          path: "app/api/users/route.js",
          detail: "POST (crear), GET (listar)",
        },
        {
          path: "app/api/users/[id]/route.js",
          detail: "GET, PUT, DELETE por ID",
        },
        {
          path: "app/api/users/[id]/addresses/route.js",
          detail: "GET direcciones del user",
        },
        {
          path: "app/api/addresses/route.js",
          detail: "POST crear dirección",
        },
        {
          path: "app/api/addresses/[id]/route.js",
          detail: "GET, PUT, DELETE",
        },
        {
          path: "app/api/addresses/[id]/validate/route.js",
          detail: "POST validar con Google Maps",
        },
        {
          path: "app/api/products/route.js",
          detail: "POST crear, GET listar con filtros",
        },
        {
          path: "app/api/products/[id]/route.js",
          detail: "GET, PUT, DELETE producto",
        },
        {
          path: "app/api/products/[id]/images/route.js",
          detail: "POST agregar imagen",
        },
        {
          path: "app/api/products/[id]/images/[imageId]/route.js",
          detail: "DELETE imagen específica",
        },
        {
          path: "app/api/products/[id]/characteristics/route.js",
          detail: "POST agregar característica",
        },
        {
          path: "app/api/categories/route.js",
          detail: "POST, GET categorías",
        },
        {
          path: "app/api/categories/[id]/route.js",
          detail: "GET, PUT, DELETE categoría",
        },
        {
          path: "app/api/categories/[id]/products/route.js",
          detail: "GET productos de la categoría",
        },
        { path: "app/api/orders/route.js", detail: "POST crear, GET listar" },
        {
          path: "app/api/orders/[id]/route.js",
          detail: "GET, PUT estado, DELETE cancelar",
        },
        {
          path: "app/api/payments/route.js",
          detail: "POST crear preferencia MP",
        },
        {
          path: "app/api/payments/[id]/route.js",
          detail: "GET estado del pago",
        },
        {
          path: "app/api/payments/webhook/route.js",
          detail: "POST IPN de MercadoPago",
        },
        {
          path: "app/api/shipments/[id]/route.js",
          detail: "GET, PUT envío",
        },
      ],
    },
    {
      id: "controllers",
      label: "🎛️ Controllers",
      color: "#dbeafe",
      accent: "#3b82f6",
      description:
        "Orchestrators del sistema. Reciben datos ya parseados, ejecutan validaciones de entrada, coordina las llamadas a los servicios, y preparan la respuesta. Es el 'director de la película'.",
      rule: "Un controller por recurso. Contiene la lógica de coordinar pasos, NO la lógica de negocio pura.",
      files: [
        {
          path: "controllers/userController.js",
          detail: "CRUD de usuarios, delega a userService",
        },
        {
          path: "controllers/addressController.js",
          detail: "CRUD direcciones + validación Google Maps",
        },
        {
          path: "controllers/productController.js",
          detail: "CRUD productos + imágenes + características",
        },
        {
          path: "controllers/categoryController.js",
          detail: "CRUD categorías jerárquicas",
        },
        {
          path: "controllers/orderController.js",
          detail: "Crear, listar, cambiar estado de órdenes",
        },
        {
          path: "controllers/paymentController.js",
          detail: "Crear preferencia MP, procesar webhook",
        },
        {
          path: "controllers/shipmentController.js",
          detail: "Leer y actualizar estado de envíos",
        },
      ],
    },
    {
      id: "services",
      label: "⚙️ Services (Business Logic)",
      color: "#fce7f3",
      accent: "#ec4899",
      description:
        "Aquí vive la lógica de negocio pura. Las reglas que no cambian si cambias la base de datos o el framework. Son las más testables. Cada service conoce solo su dominio.",
      rule: "Lógica de negocio pura. No conocen req/res. Se pueden testear en aislamiento.",
      files: [
        {
          path: "services/userService.js",
          detail: "Crear, buscar, validar usuarios, hash password",
        },
        {
          path: "services/addressService.js",
          detail: "CRUD direcciones, lógica de default",
        },
        {
          path: "services/productService.js",
          detail: "Crear productos, gestionar stock, búsqueda",
        },
        {
          path: "services/categoryService.js",
          detail: "Jerarquía de categorías, slugs",
        },
        {
          path: "services/orderService.js",
          detail: "Crear orden, calcular totales, cambiar estado, snapshots",
        },
        {
          path: "services/paymentService.js",
          detail: "Crear preferencia, procesar webhook, sync estado",
        },
        {
          path: "services/shipmentService.js",
          detail: "Crear envío desde orden, actualizar tracking",
        },
      ],
    },
    {
      id: "lib",
      label: "📦 Lib (External Integrations)",
      color: "#ede9fe",
      accent: "#8b5cf6",
      description:
        "Wrappers de servicios externos. Si MercadoPago cambia su API, solo cambias aquí. Los services no conocen los detalles de las APIs externas.",
      rule: "Una clase/módulo por servicio externo. Aisla las dependencias de terceros.",
      files: [
        {
          path: "lib/mercadopago.js",
          detail: "Crear preferencias, obtener pagos, validar webhooks",
        },
        {
          path: "lib/firebase.js",
          detail: "Upload, delete, obtener URL de imágenes",
        },
        {
          path: "lib/googleMaps.js",
          detail: "Geocodificar direcciones, validar, obtener placeId",
        },
      ],
    },
    {
      id: "models",
      label: "🗄️ Models (Mongoose Schemas)",
      color: "#dcfce7",
      accent: "#22c55e",
      description:
        "Definición de la estructura de datos en MongoDB. Incluyen validaciones a nivel de esquema, virtuals, hooks (pre/post save), y métodos estáticos. Son el 'contrato' de los datos.",
      rule: "Un modelo por entidad. Validaciones, virtuals y hooks aquí. Nada de lógica de negocio compleja.",
      files: [
        { path: "models/User.js", detail: "firstName, lastName, email, dni, role" },
        { path: "models/Address.js", detail: "Dirección completa con coordenadas" },
        { path: "models/Category.js", detail: "Jerárquica (self-reference parent)" },
        { path: "models/Product.js", detail: "Producto base con precio, stock, sku" },
        { path: "models/ProductImage.js", detail: "Imágenes con isPrimary y orden" },
        { path: "models/ProductCharacteristic.js", detail: "key-value polimórfico (Mixed)" },
        { path: "models/DeliveryType.js", detail: "PICKUP / DELIVERY con precios" },
        { path: "models/Order.js", detail: "Estado, historial, totales, customerData" },
        { path: "models/OrderItem.js", detail: "Item con productSnapshot" },
        { path: "models/Payment.js", detail: "Datos de MercadoPago, estados" },
        { path: "models/Shipment.js", detail: "Tracking, carrier, estados" },
        { path: "models/index.js", detail: "Export de todos los modelos" },
      ],
    },
    {
      id: "middleware",
      label: "🛡️ Middleware",
      color: "#fef3c7",
      accent: "#f59e0b",
      description:
        "Funciones que interceptan las requests antes de que lleguen al controller. Auth, validación, rate limiting, error handling centralizado.",
      rule: "Lógica transversal que aplica a múltiples rutas. Componer como pipeline.",
      files: [
        { path: "middleware/auth.js", detail: "Verificar JWT, extraer usuario" },
        { path: "middleware/roleGuard.js", detail: "Verificar rol (admin, user)" },
        { path: "middleware/errorHandler.js", detail: "Catch global de errores, response formatteada" },
        { path: "middleware/validateRequest.js", detail: "Validar body/params/query de incoming requests" },
      ],
    },
    {
      id: "config",
      label: "⚙️ Config & Utils",
      color: "#f3f4f6",
      accent: "#6b7280",
      description:
        "Configuración de conexión a DB, constantes del sistema (enums de estados, roles), y utilidades genéricas reutilizables.",
      rule: "Config = solo configuración. Utils = helpers puros sin estado.",
      files: [
        { path: "config/database.js", detail: "Conexión Mongoose con retry y pooling" },
        { path: "utils/constants.js", detail: "Enums: ORDER_STATUS, PAYMENT_STATUS, ROLES..." },
        { path: "utils/response.js", detail: "Helpers para formatear success/error responses" },
        { path: "utils/slugify.js", detail: "Generar slugs únicos para productos/categorías" },
        { path: "utils/orderNumber.js", detail: "Generar números de orden únicos" },
      ],
    },
  ],
};

const flowSteps = [
  { label: "HTTP Request", icon: "🌐", color: "#94a3b8" },
  { label: "Route", icon: "🛣️", color: "#64748b" },
  { label: "Middleware", icon: "🛡️", color: "#f59e0b" },
  { label: "Controller", icon: "🎛️", color: "#3b82f6" },
  { label: "Service", icon: "⚙️", color: "#ec4899" },
  { label: "Lib / Model", icon: "📦", color: "#8b5cf6" },
  { label: "MongoDB", icon: "🗄️", color: "#22c55e" },
];

export default function ArchitectureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [hoveredFlow, setHoveredFlow] = useState(null);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        minHeight: "100vh",
        color: "#e2e8f0",
        padding: "32px 24px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          E-Commerce Next.js 16 — Clean Architecture
        </h1>
        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>
          Clica en cada capa para ver los archivos y su responsabilidad
        </p>
      </div>

      {/* Data Flow */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: "18px 20px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "#64748b",
            marginBottom: "12px",
            fontWeight: "600",
          }}
        >
          Flujo de datos (Request → Response)
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexWrap: "wrap",
          }}
        >
          {flowSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                onMouseEnter={() => setHoveredFlow(i)}
                onMouseLeave={() => setHoveredFlow(null)}
                style={{
                  background:
                    hoveredFlow === i
                      ? step.color + "33"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${hoveredFlow === i ? step.color : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: hoveredFlow === i ? step.color : "#cbd5e1",
                  cursor: "default",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {step.icon} {step.label}
              </div>
              {i < flowSteps.length - 1 && (
                <span style={{ color: "#475569", fontSize: "16px" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {architecture.layers.map((layer) => {
          const isOpen = selectedLayer === layer.id;
          return (
            <div
              key={layer.id}
              style={{
                borderRadius: "12px",
                border: `1px solid ${isOpen ? layer.accent + "55" : "rgba(255,255,255,0.07)"}`,
                background: isOpen
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.02)",
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              {/* Layer Header */}
              <div
                onClick={() =>
                  setSelectedLayer(isOpen ? null : layer.id)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: layer.accent,
                      boxShadow: isOpen ? `0 0 8px ${layer.accent}` : "none",
                      transition: "box-shadow 0.3s",
                    }}
                  />
                  <span style={{ fontWeight: "700", fontSize: "15px", color: "#f1f5f9" }}>
                    {layer.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "20px",
                      padding: "2px 8px",
                    }}
                  >
                    {layer.files.length} archivos
                  </span>
                </div>
                <span
                  style={{
                    color: "#64748b",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s",
                    fontSize: "14px",
                  }}
                >
                  ▼
                </span>
              </div>

              {/* Layer Content */}
              {isOpen && (
                <div style={{ padding: "0 18px 18px" }}>
                  {/* Description + Rule */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        flex: "1",
                        minWidth: "200px",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: layer.accent, fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        ¿Qué hace?
                      </div>
                      <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
                        {layer.description}
                      </div>
                    </div>
                    <div
                      style={{
                        background: layer.accent + "15",
                        border: `1px solid ${layer.accent}33`,
                        borderRadius: "8px",
                        padding: "12px 14px",
                        minWidth: "240px",
                        flex: "0 0 auto",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: layer.accent, fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        📌 Regla
                      </div>
                      <div style={{ fontSize: "13px", color: layer.accent, fontWeight: "600" }}>
                        {layer.rule}
                      </div>
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "6px",
                    }}
                  >
                    {layer.files.map((file, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: "7px",
                          padding: "9px 12px",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span style={{ color: layer.accent, fontSize: "13px", marginTop: "1px" }}>
                          📄
                        </span>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#e2e8f0",
                              fontFamily: "'Consolas', 'Monaco', monospace",
                            }}
                          >
                            {file.path}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                            {file.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Principles */}
      <div
        style={{
          marginTop: "32px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "#64748b",
            marginBottom: "14px",
            fontWeight: "600",
          }}
        >
          Principios clave de esta arquitectura
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          {[
            { icon: "✂️", title: "Separación de capas", desc: "Route → Controller → Service → Model. Cada capa conoce solo a la siguiente." },
            { icon: "🧪", title: "Testabilidad", desc: "Services son puros. Se testean sin DB ni HTTP." },
            { icon: "🔧", title: "Intercambiabilidad", desc: "Si cambias MongoDB por PostgreSQL, solo cambias Models y Config." },
            { icon: "📈", title: "Escalabilidad", desc: "Agregar un nuevo recurso = agregar archivos en cada capa, sin tocar los existentes." },
            { icon: "📦", title: "Aislamiento externo", desc: "MercadoPago, Firebase, Google Maps viven en /lib. Los services no les conocen." },
            { icon: "🛡️", title: "Middleware pipeline", desc: "Auth, validación y error handling aplican a todas las rutas de forma consistente." },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "8px",
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                {p.icon} <span style={{ fontWeight: "700", color: "#e2e8f0", fontSize: "13px" }}>{p.title}</span>
              </div>
              <div style={{ fontSize: "11.5px", color: "#94a3b8", lineHeight: "1.45" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
