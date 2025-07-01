"use client"

import { useState } from "react"
import { X, Plus, Minus, ShoppingCart, CheckCircle, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"

// Definición completa del tipo ProductWithSeller
interface ProductWithSeller {
  id: number
  name: string
  image: string
  price: number
  category: string
  brand: string
  grind: string
  stock: number
  description: string
  createdAt: string
  sellerId: number
  seller: {
    name: string
    phone: string
    avatar: string
  }
}

interface AddToCartModalProps {
  product: ProductWithSeller
  onClose: () => void
}

interface ConfirmationModalProps {
  product: ProductWithSeller
  quantity: number
  onClose: () => void
}

function ConfirmationModal({ product, quantity, onClose }: ConfirmationModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-sm w-full transform animate-in zoom-in-95 duration-300 border border-amber-200 dark:border-gray-700">
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
            ¡Producto Agregado!
          </h3>

          <div className="mb-4 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-amber-100 dark:border-gray-600">
            <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">{product.name}</p>
            <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
              Cantidad: {quantity} | Total: {formatPrice(product.price * quantity)}
            </p>
          </div>

          <p className="text-amber-700 dark:text-amber-300 mb-6 text-sm">
            El producto se ha agregado correctamente a tu carrito de compras
          </p>

          <div className="mb-4 flex justify-center">
            <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-medium"
          >
            Continuar Comprando
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AddToCartModal({ product, onClose }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showStockError, setShowStockError] = useState(false)
  const { addToCart, user, error, setError } = useApp()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      onClose()
      return
    }

    if (quantity > product.stock) {
      setShowStockError(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Aseguramos que el producto tenga todas las propiedades requeridas
      const productToAdd: ProductWithSeller = {
        ...product,
        description: product.description || '', // Valor por defecto si es undefined
        createdAt: product.createdAt || new Date().toISOString() // Valor por defecto si es undefined
      }

      const success = await addToCart(productToAdd, quantity)
      if (success) {
        setShowConfirmation(true)
      } else {
        alert(error || "Error agregando al carrito")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    onClose()
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
    setShowStockError(false)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
    setShowStockError(false)
  }

  if (showConfirmation) {
    return (
      <ConfirmationModal
        product={product}
        quantity={quantity}
        onClose={handleConfirmationClose}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-md w-full transform animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Añadir al carrito</h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {product.category} - {product.brand}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Granulado: {product.grind}</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{formatPrice(product.price)}</p>
          </div>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Disponibles: <span className="font-bold">{product.stock}</span> unidades
            </p>
          </div>

          {showStockError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-300 text-sm">
                Solo tenemos {product.stock} unidades disponibles. Por favor ajusta la cantidad.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cantidad</label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={decrementQuantity}
                disabled={loading}
                className="bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 text-amber-900 dark:text-gray-200 p-2 rounded-full transition-colors disabled:opacity-50"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">{quantity}</span>

              <button
                onClick={incrementQuantity}
                disabled={loading}
                className="bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 text-amber-900 dark:text-gray-200 p-2 rounded-full transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-amber-50 dark:bg-gray-800 rounded-lg border border-amber-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-2xl font-bold text-amber-900 dark:text-amber-300">{formatPrice(product.price * quantity)}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Agregando...</span>
                </div>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Añadir
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}