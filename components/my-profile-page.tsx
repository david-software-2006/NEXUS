"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, User, Mail, Phone, MapPin, Camera, Save, CheckCircle, Coffee, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { useTheme } from "@/contexts/theme-context"
import Image from "next/image"

interface MyProfilePageProps {
  onBack: () => void
}

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
  theme: "light" | "dark"
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, message, onClose, theme }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-300 border-2 ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
      }`}>
        <div className="p-8 text-center">
          <div className="relative mb-6">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center animate-pulse ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-amber-100'
            }`}>
              <Coffee className={`w-10 h-10 ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`} />
            </div>
            <div className="absolute -top-1 -right-1 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          <h3 className={`text-2xl font-bold mb-3 ${
            theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
          }`}>
            ¡Perfecto!
          </h3>
          <p className={`text-lg mb-6 leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-amber-700'
          }`}>
            {message}
          </p>

          <Button
            onClick={onClose}
            className={`px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-amber-700 hover:bg-amber-600 text-white' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Coffee className="w-4 h-4 mr-2" />
            ¡Genial!
          </Button>

          <div className="absolute top-4 left-4 w-3 h-3 bg-amber-800 rounded-full opacity-20"></div>
          <div className="absolute top-8 right-6 w-2 h-2 bg-amber-700 rounded-full opacity-30"></div>
          <div className="absolute bottom-6 left-8 w-2 h-2 bg-amber-600 rounded-full opacity-25"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-800 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  )
}

export default function MyProfilePage({ onBack }: MyProfilePageProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, updateUser } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser(formData)
      setIsEditing(false)
      setSuccessModal({
        isOpen: true,
        message: `¡Tu perfil ha sido actualizado exitosamente! ${formData.name}, ahora tu información está fresca como un café recién tostado. ☕✨`
      })
    } catch (error) {
      alert("Error al actualizar el perfil")
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      })
    }
    setIsEditing(false)
  }

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onBack} 
              variant="outline" 
              className={
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-amber-600 text-amber-800 hover:bg-amber-100'
              }
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <h1 className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-amber-900'
            }`}>
              Mi perfil
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={toggleTheme} 
              variant="ghost" 
              size="icon"
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </Button>

            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)} 
                className={
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }
              >
                Editar perfil
              </Button>
            )}
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg border overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-200'
        }`}>
          <div className={`h-32 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-700 to-gray-800' 
              : 'bg-gradient-to-r from-amber-600 to-orange-600'
          }`}></div>

          <div className="relative px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className={`relative w-32 h-32 rounded-full border-4 shadow-lg overflow-hidden ${
                theme === 'dark' ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-100'
              }`}>
                <Image
                  src={formData.avatar || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  }`}>
                    <User className="w-4 h-4" />
                    <span>Nombre completo</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`mt-2 ${
                      !isEditing 
                        ? theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-amber-50' 
                        : ''
                    }`}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  }`}>
                    <Mail className="w-4 h-4" />
                    <span>Correo electrónico</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`mt-2 ${
                      !isEditing 
                        ? theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-amber-50' 
                        : ''
                    }`}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  }`}>
                    <Phone className="w-4 h-4" />
                    <span>Teléfono</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`mt-2 ${
                      !isEditing 
                        ? theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-amber-50' 
                        : ''
                    }`}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                  }`}>
                    <MapPin className="w-4 h-4" />
                    <span>Dirección</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`mt-2 ${
                      !isEditing 
                        ? theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-amber-50' 
                        : ''
                    }`}
                  />
                </div>
              </div>

              {!isEditing && (
                <div className={`grid md:grid-cols-3 gap-4 mt-8 pt-6 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-amber-200'
                }`}>
                  <div className={`text-center p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-amber-100'
                  }`}>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                    }`}>
                      {user ? new Date().getFullYear() - 2020 : 0}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-amber-700'
                    }`}>
                      Años en NEXUS
                    </p>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'
                  }`}>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-orange-300' : 'text-orange-800'
                    }`}>
                      4.8
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-amber-700'
                    }`}>
                      Calificación
                    </p>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-100'
                  }`}>
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
                    }`}>
                      Premium
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-amber-700'
                    }`}>
                      Estado
                    </p>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex space-x-3 pt-6">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className={`flex-1 ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-amber-400 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className={`flex-1 ${
                      theme === 'dark' 
                        ? 'bg-amber-600 hover:bg-amber-700' 
                        : 'bg-amber-700 hover:bg-amber-800'
                    } text-white`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Guardar cambios
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>

        <SuccessModal
          isOpen={successModal.isOpen}
          message={successModal.message}
          onClose={() => setSuccessModal({ isOpen: false, message: "" })}
          theme={theme}
        />
      </div>
    </div>
  )
}