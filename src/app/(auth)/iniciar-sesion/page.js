'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
  const res = await authService.login(formData.email, formData.password);
  console.log('LOGIN OK FRONT:', res);
  router.push('/');
} catch (err) {
  console.error('LOGIN ERROR FRONT:', err);
  setError(
    err.response?.data?.message ||
    err.message ||
    'Error al iniciar sesión. Verifica tus credenciales.'
  );
}

  };

  const handleGoogleLogin = () => {
    // Aquí iría tu lógica de Google OAuth
    console.log('Google login');
  };

  const handleRegisterRedirect = () => {
    router.push('/registrarse');
  };

  const handleForgotPassword = () => {
    router.push('/recuperar-contrasena');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Mesh de fondo */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 bg-zinc-950/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Panel izquierdo - Formulario */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            {/* Logo y título */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500"
                  style={{
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)',
                  }}
                >
                  <Sparkles className="absolute inset-0 m-auto text-white" size={24} />
                </div>
                <div>
                  <h2
                    className="font-black text-2xl tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    AKARUMI YUME
                  </h2>
                  <p className="text-xs text-gray-500 font-light tracking-wider">明るみ夢</p>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido de vuelta
              </h1>
              <p className="text-gray-400 text-sm">
                Inicia sesión para continuar tu aventura
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Recordar y Olvidaste contraseña */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
                  />
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Recordarme
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium disabled:opacity-50"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-zinc-950 text-gray-500">o continúa con</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                />
                <path
                  fill="#34A853"
                  d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                />
                <path
                  fill="#4A90E2"
                  d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                />
              </svg>
              <span>Iniciar sesión con Google</span>
            </button>

            {/* Registro */}
            <div className="text-center pt-6">
              <p className="text-gray-400 text-sm">
                ¿Aún no estás registrado?{' '}
                <button
                  onClick={handleRegisterRedirect}
                  disabled={isLoading}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors disabled:opacity-50"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>

          {/* Panel derecho - Imagen */}
          <div className="hidden lg:block relative overflow-hidden">
            {/* Imagen de fondo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80')",
              }}
            >
              {/* Overlay con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/60 to-cyan-900/80" />
              
              {/* Mesh gradient decorativo */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, transparent 70%)',
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* Contenido sobre la imagen */}
            <div className="relative h-full flex flex-col justify-center items-center text-center p-12 text-white">
              <div className="space-y-6">
                {/* Decoración superior */}
                <div className="flex justify-center gap-2 mb-8">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/30"
                      style={{
                        animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                <h2 className="text-4xl font-black leading-tight">
                  Descubre un mundo
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300">
                    de sueños brillantes
                  </span>
                </h2>

                <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
                  Únete a miles de fans del anime y manga. Encuentra figuras exclusivas, 
                  manga raro y merchandising único.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-yellow-300">10K+</div>
                    <div className="text-xs text-white/70">Productos</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-pink-300">50K+</div>
                    <div className="text-xs text-white/70">Usuarios</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-cyan-300">98%</div>
                    <div className="text-xs text-white/70">Satisfacción</div>
                  </div>
                </div>

                {/* Decoración inferior */}
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/20"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;