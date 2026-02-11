import { useState } from "react";

const frontendStructure = {
  layers: [
    {
      id: "pages",
      label: "📄 Páginas (Next.js App Router)",
      color: "#dbeafe",
      accent: "#3b82f6",
      description: "Rutas públicas y protegidas con SEO en español. Usan hooks y componentes para construir la UI.",
      groups: [
        {
          name: "Auth",
          routes: [
            { path: "/iniciar-sesion", desc: "Login" },
            { path: "/registrarse", desc: "Registro" },
            { path: "/recuperar-contraseña", desc: "Solicitar reset" },
            { path: "/restablecer-contraseña/[token]", desc: "Form nueva contraseña" },
          ]
        },
        {
          name: "Shop",
          routes: [
            { path: "/productos", desc: "Lista con filtros" },
            { path: "/productos/[slug]", desc: "Detalle producto" },
            { path: "/categorias/[slug]", desc: "Productos por categoría" },
            { path: "/buscar", desc: "Resultados búsqueda" },
            { path: "/carrito", desc: "Carrito de compras" },
            { path: "/checkout", desc: "Proceso checkout" },
            { path: "/checkout/exito", desc: "Pago confirmado" },
            { path: "/checkout/pendiente", desc: "Pago pendiente" },
            { path: "/checkout/error", desc: "Pago rechazado" },
          ]
        },
        {
          name: "Usuario",
          routes: [
            { path: "/mi-perfil", desc: "Ver y editar perfil" },
            { path: "/mis-direcciones", desc: "Gestión direcciones" },
            { path: "/mis-ordenes", desc: "Historial órdenes" },
            { path: "/mis-ordenes/[id]", desc: "Detalle orden" },
          ]
        },
        {
          name: "Admin",
          routes: [
            { path: "/admin", desc: "Dashboard stats" },
            { path: "/admin/productos", desc: "Gestión productos" },
            { path: "/admin/categorias", desc: "Gestión categorías" },
            { path: "/admin/ordenes", desc: "Gestión órdenes" },
            { path: "/admin/usuarios", desc: "Gestión usuarios" },
            { path: "/admin/envios", desc: "Tracking envíos" },
          ]
        }
      ]
    },
    {
      id: "components",
      label: "🧩 Componentes React",
      color: "#fce7f3",
      accent: "#ec4899",
      description: "Componentes reutilizables organizados por dominio. Usan hooks y contexts para acceder a estado global.",
      groups: [
        { name: "Product", count: 8, examples: "ProductCard, ProductGrid, ProductDetail, ProductImageGallery" },
        { name: "Filters", count: 5, examples: "ProductFilters, SearchBar, CategoryFilter, PriceRangeSlider" },
        { name: "Cart", count: 4, examples: "CartDrawer, CartItem, CartSummary, EmptyCart" },
        { name: "Checkout", count: 6, examples: "CheckoutStepper, CheckoutForm, DeliveryTypeSelector" },
        { name: "Address", count: 4, examples: "AddressCard, AddressForm, GoogleMapPreview, AddressModal" },
        { name: "Order", count: 6, examples: "OrderCard, OrderDetail, OrderStatusBadge, OrderTimeline" },
        { name: "User", count: 3, examples: "ProfileForm, ChangePasswordForm, ProfileAvatar" },
        { name: "Admin", count: 10, examples: "ProductTable, ProductFormAdmin, ImageUploader, OrdersTable" },
        { name: "UI", count: 12, examples: "Button, Input, Modal, Spinner, Alert, Pagination" },
      ]
    },
    {
      id: "hooks",
      label: "🪝 Custom Hooks",
      color: "#e0e7ff",
      accent: "#6366f1",
      description: "Lógica reutilizable extraída de componentes. Encapsulan estado, efectos secundarios y lógica compleja.",
      items: [
        { name: "useAuth", desc: "Acceso al AuthContext (user, login, logout)" },
        { name: "useCart", desc: "Acceso al CartContext (cart, addItem, removeItem)" },
        { name: "useDebounce", desc: "Debounce de valores (búsqueda)" },
        { name: "useLocalStorage", desc: "Persistir estado en localStorage" },
        { name: "useMediaQuery", desc: "Responsive breakpoints" },
        { name: "useProducts", desc: "Fetch productos con filtros" },
        { name: "useInfiniteScroll", desc: "Scroll infinito con IntersectionObserver" },
        { name: "useToast", desc: "Notificaciones toast (success, error)" },
      ]
    },
    {
      id: "contexts",
      label: "🌐 React Contexts",
      color: "#fef3c7",
      accent: "#f59e0b",
      description: "Estado global compartido entre componentes sin prop drilling. Providers envuelven toda la app.",
      items: [
        { name: "AuthContext", desc: "user, loading, login(), register(), logout()" },
        { name: "CartContext", desc: "cart, addItem(), removeItem(), total, itemCount" },
        { name: "UIContext", desc: "modales, drawers, toasts globales" },
      ]
    },
    {
      id: "services",
      label: "📡 Services (API Calls)",
      color: "#dcfce7",
      accent: "#22c55e",
      description: "Llamadas centralizadas al backend usando Axios. Un service por recurso del backend. Retornan promesas.",
      items: [
        { name: "authService", methods: "login(), register(), logout(), requestPasswordReset()" },
        { name: "userService", methods: "getProfile(), updateProfile(), changePassword()" },
        { name: "addressService", methods: "getAddresses(), createAddress(), validateAddress()" },
        { name: "productService", methods: "getProducts(), getProductBySlug(), searchProducts()" },
        { name: "categoryService", methods: "getCategories(), getCategoryBySlug(), getProductsByCategory()" },
        { name: "orderService", methods: "createOrder(), getOrders(), getOrderById(), cancelOrder()" },
        { name: "paymentService", methods: "createPayment(), getPaymentById()" },
        { name: "shipmentService", methods: "getShipmentById(), updateShipmentStatus()" },
        { name: "cartService", methods: "getCart(), addItem(), removeItem() [localStorage]" },
      ]
    },
    {
      id: "lib",
      label: "🔧 Lib (Config)",
      color: "#f3f4f6",
      accent: "#6b7280",
      description: "Configuraciones base de la app. Axios interceptors, helpers de autenticación.",
      items: [
        { name: "axios.js", desc: "Instancia configurada con interceptors (token, error handling)" },
        { name: "auth.js", desc: "saveAuth(), getAuth(), clearAuth(), isAuthenticated()" },
      ]
    },
    {
      id: "utils",
      label: "🛠️ Utils",
      color: "#ede9fe",
      accent: "#8b5cf6",
      description: "Utilidades puras sin efectos secundarios. Formatters, validators, helpers.",
      items: [
        { name: "constants.js", desc: "ORDER_STATUS, SHIPMENT_STATUS, enums" },
        { name: "formatters.js", desc: "formatPrice(), formatDate(), truncate()" },
        { name: "validators.js", desc: "isValidEmail(), isValidDNI(), isValidPassword()" },
        { name: "localStorage.js", desc: "setItem(), getItem(), removeItem() helpers" },
        { name: "seo.js", desc: "generateMetaTags(), generateProductSchema()" },
      ]
    },
  ]
};

const dataFlow = [
  { step: "Usuario interactúa", icon: "👆", color: "#94a3b8" },
  { step: "Componente", icon: "🧩", color: "#ec4899" },
  { step: "Hook", icon: "🪝", color: "#6366f1" },
  { step: "Context / Service", icon: "📡", color: "#22c55e" },
  { step: "Axios → Backend", icon: "🌐", color: "#3b82f6" },
  { step: "Response", icon: "✅", color: "#22c55e" },
  { step: "Estado actualizado", icon: "🔄", color: "#6366f1" },
  { step: "Re-render UI", icon: "🎨", color: "#ec4899" },
];

export default function FrontendArchitecture() {
  const [selectedLayer, setSelectedLayer] = useState(null);

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          letterSpacing: "-0.5px",
        }}>
          Frontend E-Commerce — Arquitectura React
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
          Services centralizados + Hooks + Contexts + Componentes reutilizables
        </p>
      </div>

      {/* Data Flow */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "18px 20px",
        marginBottom: "32px",
      }}>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#64748b",
          marginBottom: "12px",
          fontWeight: "600",
        }}>
          Flujo de Datos (User Interaction → UI Update)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
          {dataFlow.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${step.color}33`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                color: step.color,
                whiteSpace: "nowrap",
              }}>
                {step.icon} {step.step}
              </div>
              {i < dataFlow.length - 1 && (
                <span style={{ color: "#475569", fontSize: "16px" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {frontendStructure.layers.map((layer) => {
          const isOpen = selectedLayer === layer.id;
          return (
            <div key={layer.id} style={{
              borderRadius: "12px",
              border: `1px solid ${isOpen ? layer.accent + "55" : "rgba(255,255,255,0.07)"}`,
              background: isOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
              overflow: "hidden",
              transition: "all 0.25s ease",
            }}>
              <div
                onClick={() => setSelectedLayer(isOpen ? null : layer.id)}
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
                  <div style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: layer.accent,
                    boxShadow: isOpen ? `0 0 8px ${layer.accent}` : "none",
                    transition: "box-shadow 0.3s",
                  }} />
                  <span style={{ fontWeight: "700", fontSize: "15px", color: "#f1f5f9" }}>
                    {layer.label}
                  </span>
                </div>
                <span style={{
                  color: "#64748b",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s",
                  fontSize: "14px",
                }}>▼</span>
              </div>

              {isOpen && (
                <div style={{ padding: "0 18px 18px" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: "16px",
                    fontSize: "13px",
                    color: "#cbd5e1",
                    lineHeight: "1.5",
                  }}>
                    {layer.description}
                  </div>

                  {/* Groups (for pages) */}
                  {layer.groups && (
                    <div style={{ display: "grid", gap: "12px" }}>
                      {layer.groups.map((group, i) => (
                        <div key={i} style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}>
                          <div style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: layer.accent,
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}>
                            {group.name}
                          </div>
                          <div style={{ display: "grid", gap: "4px" }}>
                            {group.routes.map((route, j) => (
                              <div key={j} style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "12px",
                              }}>
                                <span style={{ color: layer.accent }}>→</span>
                                <code style={{
                                  color: "#e2e8f0",
                                  fontFamily: "monospace",
                                  flex: "0 0 auto",
                                  minWidth: "200px",
                                }}>{route.path}</code>
                                <span style={{ color: "#64748b" }}>{route.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Items (for other layers) */}
                  {layer.items && (
                    <div style={{ display: "grid", gap: "6px" }}>
                      {layer.items.map((item, i) => (
                        <div key={i} style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: "7px",
                          padding: "10px 12px",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}>
                          <div style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#e2e8f0",
                            fontFamily: "monospace",
                            marginBottom: "2px",
                          }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                            {item.desc || item.methods}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{
        marginTop: "32px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "20px",
      }}>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#64748b",
          marginBottom: "14px",
          fontWeight: "600",
        }}>
          Resumen de la Estructura
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "10px",
        }}>
          {[
            { label: "Páginas", value: "40+", icon: "📄" },
            { label: "Componentes", value: "58+", icon: "🧩" },
            { label: "Hooks", value: "8", icon: "🪝" },
            { label: "Contexts", value: "3", icon: "🌐" },
            { label: "Services", value: "9", icon: "📡" },
            { label: "Utils", value: "5", icon: "🛠️" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{stat.icon}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#e2e8f0" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Principles */}
      <div style={{
        marginTop: "32px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "20px",
      }}>
        <div style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#64748b",
          marginBottom: "14px",
          fontWeight: "600",
        }}>
          Principios de diseño
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            { icon: "🎯", title: "Services centralizados", desc: "Todas las llamadas HTTP en un solo lugar" },
            { icon: "♻️", title: "Componentes reutilizables", desc: "DRY: no repetir código entre páginas" },
            { icon: "🪝", title: "Custom hooks", desc: "Lógica extraída y testeabl" },
            { icon: "🌐", title: "Contexts para estado global", desc: "Auth, Cart, UI sin prop drilling" },
            { icon: "🇪🇸", title: "SEO en español", desc: "URLs amigables para buscadores" },
            { icon: "🔒", title: "Rutas protegidas", desc: "Admin solo accesible con rol ADMIN" },
          ].map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
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
