"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Package, DollarSign, Upload, X, Edit, Trash2, CheckCircle, Coffee, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/contexts/app-context"
import { useTheme } from "@/contexts/theme-context"
import Image from "next/image"

interface MyProductsPageProps {
  onBack: () => void
}

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
  theme: string
}

interface ConfirmModalProps {
  isOpen: boolean
  productName: string
  onConfirm: () => void
  onCancel: () => void
  theme: string
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  brand: string
  grind: string
  description: string
  image: string
  stock: number
  sellerId: number
}

interface FormData {
  name: string
  price: string
  category: string
  brand: string
  grind: string
  description: string
  image: string
  stock: string
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
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-700/50' 
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
            theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
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

          <div className={`absolute top-4 left-4 w-3 h-3 rounded-full opacity-20 ${
            theme === 'dark' ? 'bg-amber-500' : 'bg-amber-800'
          }`}></div>
          <div className={`absolute top-8 right-6 w-2 h-2 rounded-full opacity-30 ${
            theme === 'dark' ? 'bg-amber-400' : 'bg-amber-700'
          }`}></div>
          <div className={`absolute bottom-6 left-8 w-2 h-2 rounded-full opacity-25 ${
            theme === 'dark' ? 'bg-amber-500' : 'bg-amber-600'
          }`}></div>
          <div className={`absolute bottom-4 right-4 w-3 h-3 rounded-full opacity-20 ${
            theme === 'dark' ? 'bg-amber-500' : 'bg-amber-800'
          }`}></div>
        </div>
      </div>
    </div>
  )
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, productName, onConfirm, onCancel, theme }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-red-200'
      }`}>
        <div className="p-8 text-center">
          <div className="relative mb-6">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-red-100'
            }`}>
              <AlertTriangle className={`w-10 h-10 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
            </div>
          </div>

          <h3 className={`text-2xl font-bold mb-3 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            ¿Eliminar producto?
          </h3>
          <p className={`text-lg mb-6 leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            ¿Estás seguro de que quieres eliminar <span className={`font-semibold ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
            }`}>"{productName}"</span>?
          </p>
          <p className={`text-sm mb-8 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>
            Esta acción no se puede deshacer.
          </p>

          <div className="flex space-x-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className={`flex-1 ${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 ${
                theme === 'dark' 
                  ? 'bg-red-700 hover:bg-red-600' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyProductsPage({ onBack }: MyProductsPageProps) {
  const { products, user, addProduct, updateProduct, deleteProduct, loadProducts, error, setError } = useApp()
  const { theme } = useTheme()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" })
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    productId: 0, 
    productName: "" 
  })
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    category: "",
    brand: "",
    grind: "",
    description: "",
    image: "",
    stock: "0",
  })

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const myProducts = products.filter((product) => product.sellerId === user?.id)

  const categories = [
    "Arábica",
    "Robusta",
    "Mezcla",
    "Espresso",
    "Descafeinado",
    "Orgánico",
    "Tostado Claro",
    "Tostado Medio",
    "Tostado Oscuro",
    "Premium",
  ]

  const grindTypes = ["Grano Entero", "Molido Grueso", "Molido Medio", "Molido Fino", "Molido Extra Fino"]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      grind: product.grind,
      description: product.description,
      image: product.image,
      stock: product.stock ? product.stock.toString() : "0", // Asegurarse de que stock tenga un valor
    })
    setShowEditForm(true)
  }

  const handleDeleteProductClick = (productId: number, productName: string) => {
    setConfirmModal({
      isOpen: true,
      productId,
      productName
    })
  }

  const handleConfirmDelete = async () => {
    const { productId, productName } = confirmModal
    setConfirmModal({ isOpen: false, productId: 0, productName: "" })
    
    setLoading(true)
    const success = await deleteProduct(productId)
    if (success) {
      setSuccessModal({
        isOpen: true,
        message: `Tu café "${productName}" ha sido eliminado exitosamente. ☕`
      })
    } else {
      alert(error || "Error eliminando producto")
    }
    setLoading(false)
  }

  const handleCancelDelete = () => {
    setConfirmModal({ isOpen: false, productId: 0, productName: "" })
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.price || !formData.category || !formData.brand || !formData.grind) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    setLoading(true)

    try {
      if (!editingProduct) return

      const success = await updateProduct(editingProduct.id, {
        name: formData.name,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        grind: formData.grind,
        description: formData.description,
        image: formData.image || "/placeholder.svg?height=300&width=300",
        stock: Number.parseInt(formData.stock) || 0,
      })

      if (success) {
        setFormData({
          name: "",
          price: "",
          category: "",
          brand: "",
          grind: "",
          description: "",
          image: "",
          stock: "0",
        })
        setShowEditForm(false)
        const productName = editingProduct.name
        setEditingProduct(null)
        setSuccessModal({
          isOpen: true,
          message: `¡Tu café "${productName}" ha sido actualizado perfectamente! Ahora está listo para conquistar nuevos paladares. ☕✨`
        })
      } else {
        alert(error || "Error actualizando producto")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.price || !formData.category || !formData.brand || !formData.grind) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    setLoading(true)

    try {
      const success = await addProduct({
        name: formData.name,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        grind: formData.grind,
        description: formData.description,
        image: formData.image || "/placeholder.svg?height=300&width=300",
        stock: Number.parseInt(formData.stock) || 0,
      })

      if (success) {
        const productName = formData.name
        setFormData({
          name: "",
          price: "",
          category: "",
          brand: "",
          grind: "",
          description: "",
          image: "",
          stock: "0",
        })
        setShowAddForm(false)
        setSuccessModal({
          isOpen: true,
          message: `¡Tu café "${productName}" ha sido agregado exitosamente! Ya está disponible para los amantes del café. ☕🎉`
        })
      } else {
        alert(error || "Error agregando producto")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onBack} 
              variant="outline" 
              className={
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-amber-300 text-amber-700 hover:bg-amber-50'
              }
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <h1 className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
            }`}>
              Mis productos
            </h1>
          </div>

          <Button 
            onClick={() => setShowAddForm(true)} 
            className={
              theme === 'dark' 
                ? 'bg-amber-700 hover:bg-amber-600 text-white' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar producto
          </Button>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-red-900/30 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={theme === 'dark' ? 'text-red-300' : 'text-red-600'}>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`rounded-2xl shadow-lg p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-amber-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-amber-100'
              }`}>
                <Package className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total productos
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  {myProducts.length}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl shadow-lg p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-amber-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-green-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Valor promedio
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  {myProducts.length > 0
                    ? formatPrice(myProducts.reduce((sum, p) => sum + p.price, 0) / myProducts.length)
                    : formatPrice(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-amber-100'
        }`}>
          <div className={`p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-amber-100'
          }`}>
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
            }`}>
              Mis productos publicados
            </h2>
          </div>

          {myProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No tienes productos publicados
              </h3>
              <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                Agrega tu primer producto para comenzar a vender.
              </p>
              <Button 
                onClick={() => setShowAddForm(true)} 
                className={
                  theme === 'dark' 
                    ? 'bg-amber-700 hover:bg-amber-600 text-white' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar producto
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className={`rounded-lg p-4 border relative group ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-700/80' 
                        : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                    } transition-colors`}
                  >
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg?height=192&width=192"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className={`p-2 rounded-full shadow-lg transition-colors ${
                          theme === 'dark' 
                            ? 'bg-blue-600 hover:bg-blue-500' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProductClick(product.id, product.name)}
                        className={`p-2 rounded-full shadow-lg transition-colors ${
                          theme === 'dark' 
                            ? 'bg-red-600 hover:bg-red-500' 
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className={`font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {product.name}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {product.category} - {product.brand}
                    </p>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Granulado: {product.grind}
                    </p>
                    <p className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                    }`}>
                      {formatPrice(product.price)}
                    </p>
                    <p className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Disponibles: <span className="font-semibold">{product.stock || 0}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {(showAddForm || showEditForm) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
                  }`}>
                    {editingProduct ? "Editar producto" : "Agregar nuevo producto"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setShowEditForm(false)
                      setEditingProduct(null)
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {error && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-red-900/30 border border-red-800' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={theme === 'dark' ? 'text-red-300' : 'text-red-600'}>{error}</p>
                  </div>
                )}

                <form onSubmit={editingProduct ? handleUpdateSubmit : handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Nombre del producto *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Café Arábica Premium"
                        className={`mt-1 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 focus:border-amber-500 text-white' 
                            : ''
                        }`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Precio (COP) *
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="100"
                        min="0"
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="25000"
                        className={`mt-1 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 focus:border-amber-500 text-white' 
                            : ''
                        }`}
                      />
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Ingresa el precio sin puntos ni comas
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Categoría *
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("category", value)} 
                        value={formData.category}
                        required
                      >
                        <SelectTrigger className={`mt-1 ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''
                        }`}>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category} 
                              value={category}
                              className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="brand" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Marca *
                      </Label>
                      <Input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Ej: Café del Valle"
                        className={`mt-1 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 focus:border-amber-500 text-white' 
                            : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grind" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Tipo de granulado *
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("grind", value)} 
                        value={formData.grind}
                        required
                      >
                        <SelectTrigger className={`mt-1 ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''
                        }`}>
                          <SelectValue placeholder="Selecciona el tipo de granulado" />
                        </SelectTrigger>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          {grindTypes.map((grind) => (
                            <SelectItem 
                              key={grind} 
                              value={grind}
                              className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                            >
                              {grind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stock" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        Cantidad disponible *
                      </Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        required
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="Ej: 50"
                        className={`mt-1 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 focus:border-amber-500 text-white' 
                            : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe tu producto de café..."
                      className={`mt-1 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 focus:border-amber-500 text-white' 
                          : ''
                      }`}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      Imagen del producto
                    </Label>
                    <div className="mt-1">
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          theme === 'dark' 
                            ? 'border-amber-600/50 hover:border-amber-500' 
                            : 'border-amber-300 hover:border-amber-400'
                        }`}
                      >
                        {formData.image ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={formData.image || "/placeholder.svg?height=128&width=128"}
                              alt="Preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className={`w-8 h-8 mx-auto mb-2 ${
                              theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                            }`} />
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                            }`}>
                              Click para subir imagen
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setShowEditForm(false)
                        setEditingProduct(null)
                      }}
                      variant="outline"
                      className={`flex-1 ${
                        theme === 'dark' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className={`flex-1 ${
                        theme === 'dark' 
                          ? 'bg-amber-700 hover:bg-amber-600' 
                          : 'bg-amber-600 hover:bg-amber-700'
                      } text-white`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{editingProduct ? "Actualizando..." : "Agregando..."}</span>
                        </div>
                      ) : (
                        <>
                          <Package className="w-5 h-5 mr-2" />
                          {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          productName={confirmModal.productName}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          theme={theme}
        />

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