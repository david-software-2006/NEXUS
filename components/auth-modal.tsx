"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface AuthModalProps {
  onClose: () => void
  onLoginSuccess: () => void
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })

  const { login, register } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignIn) {
        const success = await login(formData.email, formData.password)
        if (success) {
          onLoginSuccess()
          onClose()
        } else {
          setError("Email o contraseña incorrectos")
        }
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
          setError("Todos los campos son requeridos para el registro")
          setLoading(false)
          return
        }

        const success = await register({
          ...formData,
          address: "",
        })
        if (success) {
          onLoginSuccess()
          onClose()
        } else {
          setError("Error en el registro. El email podría estar en uso.")
        }
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (error) setError("")
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordLoading(true)
    setForgotPasswordMessage("")

    try {
      // Simular envío de email de recuperación
      await new Promise(resolve => setTimeout(resolve, 2000))
      setForgotPasswordMessage("Se ha enviado un enlace de recuperación a tu email.")
      setTimeout(() => {
        setShowForgotPassword(false)
        setForgotPasswordEmail("")
        setForgotPasswordMessage("")
      }, 3000)
    } catch (error) {
      setForgotPasswordMessage("Error al enviar el email. Intenta nuevamente.")
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="w-full bg-[#532D1C] relative flex flex-col transform animate-in zoom-in-95 duration-300"
        style={{
          height: isSignIn ? "540px" : "640px",
          borderRadius: "24px",
          maxWidth: "380px",
          width: "100%"
        }}
      >
        <div 
          className="relative h-44 md:h-48 flex-shrink-0"
          style={{ 
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            overflow: "hidden"
          }}
        >
          <img
            src="images/login.jpeg"
            alt="Coffee cozy"
            className="w-full h-full object-cover object-[center_15%] md:object-[center_28%]" // Ajusté el position para subir la imagen
          />
          
          <svg
            className="absolute bottom-0 right-0 w-[150px] h-[80px] -mb-[2px]"
            viewBox="0 0 150 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 80H150V0C141 0 112 80 0 80Z" fill="#532D1C" />
          </svg>
        </div>

        <div
          className="relative overflow-y-auto"
          style={{
            background: "#532D1C",
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
            height: isSignIn ? "calc(540px - 176px)" : "calc(640px - 176px)"
          }}
        >
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col px-6 pt-4 pb-5 text-neutral-100 select-none h-full relative z-10"
          >
            <div className="flex justify-center gap-8 mb-4 relative">
              <button
                type="button"
                onClick={() => setIsSignIn(true)}
                className={`px-4 py-2 text-lg font-medium transition-all duration-200 ${
                  isSignIn 
                    ? "text-white" 
                    : "text-neutral-300 hover:text-neutral-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignIn(false)}
                className={`px-4 py-2 text-lg font-medium transition-all duration-200 ${
                  !isSignIn 
                    ? "text-white" 
                    : "text-neutral-300 hover:text-neutral-200"
                }`}
              >
                Sign Up
              </button>
              
              {/* Línea animada */}
              <div 
                className={`absolute bottom-0 h-0.5 bg-[#3D1F0F]  transition-all duration-300 ease-in-out ${
                  isSignIn 
                    ? "left-[calc(50%-4rem-1rem)] w-16" 
                    : "left-[calc(50%+1rem)] w-16"
                }`}
              />
            </div>

            {error && (
              <div className="mb-2 p-2 bg-red-500/20 border border-red-400/30 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {isSignIn ? (
                <div id="sign-in-fields" className="space-y-3">
                  <div>
                    <label htmlFor="email" className="text-sm mb-1 text-[#F3D8C7] flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-[#F3D8C7]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Address:
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-1 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="text-sm mb-1 text-[#F3D8C7] flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-[#F3D8C7]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Password:
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-1 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div id="sign-up-fields" className="space-y-3">
                  <div>
                    <label htmlFor="full-name" className="text-sm mb-1 text-[#F3D8C7]">
                      Full Name:
                    </label>
                    <input
                      id="full-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-1 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-sm mb-1 text-[#F3D8C7]">
                      Phone Number:
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-1 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="text-sm mb-1 text-[#F3D8C7]">
                      Email Address:
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-1 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-password" className="text-sm mb-1 text-[#F3D8C7]">
                      Create Password:
                    </label>
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-1 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <button
                type="submit"
                disabled={loading}
                className="mb-2 w-full py-3 rounded-full bg-[#3D1F0F] shadow-lg text-white font-medium hover:bg-[#2A1508] transition-all duration-200 disabled:opacity-50 border border-[#4A2817] shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,255,255,0.1)_inset]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isSignIn ? "Signing In..." : "Signing Up..."}</span>
                  </div>
                ) : (
                  <span>{isSignIn ? "Sign In" : "Sign Up"}</span>
                )}
              </button>

              {isSignIn && (
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="mb-2 text-center w-full text-sm text-[#F3D8C7] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Forgot Password */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-[#532D1C] rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowForgotPassword(false)
                setForgotPasswordEmail("")
                setForgotPasswordMessage("")
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-white mb-4">Reset Password</h3>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm text-[#F3D8C7] mb-2">
                  Enter your email address and we'll send you a link to reset your password.
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent border-b-2 border-[#F3D8C7] placeholder-[#F3D8C7] placeholder:text-xs py-2 px-1 text-[#F3D8C7] focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {forgotPasswordMessage && (
                <div className={`p-3 rounded text-sm ${
                  forgotPasswordMessage.includes("Error") 
                    ? "bg-red-500/20 border border-red-400/30 text-red-200" 
                    : "bg-green-500/20 border border-green-400/30 text-green-200"
                }`}>
                  {forgotPasswordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full py-3 rounded-full bg-[#3D1F0F] shadow-lg text-white font-medium hover:bg-[#2A1508] transition-all duration-200 disabled:opacity-50 border border-[#4A2817] shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,255,255,0.1)_inset]"
              >
                {forgotPasswordLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}