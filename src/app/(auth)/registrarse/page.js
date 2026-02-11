'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Phone, CreditCard, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dni: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!/^\d{7,8}$/.test(formData.dni)) {
      newErrors.dni = 'DNI inválido (7-8 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await authService.register(userData);
      
      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Fondo con imagen fija */}
      <div 
        className="absolute inset-0 bg-fixed-custom"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-black/90 to-pink-900/95"></div>
      </div>

      {/* Decoraciones de fondo */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center" style={{ padding: '2rem 1rem' }}>
        <div 
          className="w-full relative"
          style={{ 
            maxWidth: '500px',
            filter: 'drop-shadow(0 0 40px rgba(147, 51, 234, 0.5)) drop-shadow(0 0 80px rgba(236, 72, 153, 0.3))',
          }}
        >
          {/* Borde animado exterior */}
          <div 
            className="rounded-3xl overflow-hidden"
            style={{
              padding: '3px',
              background: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #9d00ff 75%, #ff0080 100%)',
              backgroundSize: '300% 300%',
              animation: 'gradient-shift 6s ease infinite',
            }}
          >
            {/* Card principal */}
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a0033 0%, #0a0015 50%, #1a0033 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Decoraciones de esquinas */}
              <div className="absolute top-0 left-0 w-20 h-20 opacity-60">
                <div className="absolute top-4 left-4 w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                <div className="absolute top-4 left-4 w-0.5 h-12 bg-gradient-to-b from-yellow-400 to-transparent"></div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 opacity-60">
                <div className="absolute top-4 right-4 w-12 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
                <div className="absolute top-4 right-4 w-0.5 h-12 bg-gradient-to-b from-cyan-400 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-20 h-20 opacity-60">
                <div className="absolute bottom-4 left-4 w-12 h-0.5 bg-gradient-to-r from-pink-400 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-0.5 h-12 bg-gradient-to-t from-pink-400 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 opacity-60">
                <div className="absolute bottom-4 right-4 w-12 h-0.5 bg-gradient-to-l from-purple-400 to-transparent"></div>
                <div className="absolute bottom-4 right-4 w-0.5 h-12 bg-gradient-to-t from-purple-400 to-transparent"></div>
              </div>

              <div className="relative" style={{ padding: '3rem 2.5rem' }}>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <Sparkles 
                      className="w-14 h-14 text-pink-400 animate-pulse"
                      style={{ filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }}
                    />
                  </div>
                  
                  <h1 
                    className="font-black mb-2 tracking-wider"
                    style={{
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, #ff0080 0%, #9d00ff 50%, #40e0d0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 30px rgba(236, 72, 153, 0.5)',
                    }}
                  >
                    ÚNETE A NOSOTROS
                  </h1>
                  
                  <p className="text-gray-400 tracking-wide" style={{ fontSize: '1rem' }}>
                    Crea tu cuenta en <span className="text-pink-400 font-bold">Akarumi Yume</span>
                  </p>

                  {/* Separador decorativo */}
                  <div 
                    className="mx-auto mt-4 h-1"
                    style={{
                      width: '150px',
                      background: 'linear-gradient(90deg, transparent, #ff0080, #9d00ff, #40e0d0, transparent)',
                    }}
                  />
                </div>

                {/* Mensajes de error/éxito */}
                {error && (
                  <div 
                    className="mb-6 rounded-xl flex items-center gap-3"
                    style={{
                      padding: '1rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div 
                    className="mb-6 rounded-xl flex items-center gap-3"
                    style={{
                      padding: '1rem',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-400 text-sm">¡Registro exitoso! Redirigiendo...</p>
                  </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-cyan-400 font-bold mb-2 text-sm tracking-wide">
                        NOMBRE
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                          style={{
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: errors.firstName ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '1rem',
                          }}
                          placeholder="Tu nombre"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-cyan-400 font-bold mb-2 text-sm tracking-wide">
                        APELLIDO
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                          style={{
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: errors.lastName ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '1rem',
                          }}
                          placeholder="Tu apellido"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-pink-400 font-bold mb-2 text-sm tracking-wide">
                      EMAIL
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                        style={{
                          padding: '1rem 1rem 1rem 3rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: errors.email ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '1rem',
                        }}
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* DNI y Teléfono */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-purple-400 font-bold mb-2 text-sm tracking-wide">
                        DNI
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="dni"
                          value={formData.dni}
                          onChange={handleChange}
                          maxLength={8}
                          className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                          style={{
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: errors.dni ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '1rem',
                          }}
                          placeholder="12345678"
                        />
                      </div>
                      {errors.dni && (
                        <p className="text-red-400 text-xs mt-1">{errors.dni}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-purple-400 font-bold mb-2 text-sm tracking-wide">
                        TELÉFONO
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                          style={{
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '2px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '1rem',
                          }}
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2 text-sm tracking-wide">
                      CONTRASEÑA
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                        style={{
                          padding: '1rem 3rem 1rem 3rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: errors.password ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '1rem',
                        }}
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-yellow-400 font-bold mb-2 text-sm tracking-wide">
                      CONFIRMAR CONTRASEÑA
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl text-white placeholder-gray-500 transition-all focus:outline-none"
                        style={{
                          padding: '1rem 3rem 1rem 3rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: errors.confirmPassword ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '1rem',
                        }}
                        placeholder="Repite tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Botón de registro */}
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full font-black tracking-widest text-white rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      padding: '1.2rem',
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #ff0080 0%, #9d00ff 50%, #00d4ff 100%)',
                      boxShadow: '0 10px 40px rgba(236, 72, 153, 0.4), 0 0 60px rgba(147, 51, 234, 0.3)',
                      marginTop: '2rem',
                    }}
                  >
                    {loading ? 'REGISTRANDO...' : success ? '✓ REGISTRADO' : 'CREAR CUENTA'}
                  </button>

                  {/* Link al login */}
                  <div className="text-center mt-6">
                    <p className="text-gray-400">
                      ¿Ya tienes cuenta?{' '}
                      <a 
                        href="/login" 
                        className="text-pink-400 hover:text-pink-300 font-bold transition-colors"
                      >
                        Inicia sesión aquí
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;