"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Plus, Minus, Trash2, CreditCard, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import CheckoutModal from "./checkout-modal"

interface CartModalProps {
  onClose: () => void
}

export default function CartModal({ onClose }: CartModalProps) {
  const { cart, removeFromCart, addToCart, user, loadCart, error, setError } = useApp()
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      loadCart()
    }
  }, [user, loadCart])

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      return
    }

    const cartItem = cart.find((item) => item.product.id === productId)
    if (cartItem) {
      const difference = newQuantity - cartItem.quantity
      if (difference > 0) {
        await addToCart(cartItem.product, difference)
      } else {
        await removeFromCart(productId)
        if (newQuantity > 0) {
          await addToCart(cartItem.product, newQuantity)
        }
      }
    }
  }

  const confirmDelete = (productId: number) => {
    setProductToDelete(productId)
  }

  const handleRemoveItem = async () => {
    if (!productToDelete) return
    
    setLoading(true)
    const success = await removeFromCart(productToDelete)
    if (!success) {
      alert("Error eliminando producto del carrito")
    }
    setLoading(false)
    setProductToDelete(null)
  }

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  if (showCheckout) {
    return <CheckoutModal onClose={() => setShowCheckout(false)} onBack={() => setShowCheckout(false)} />
  }

  return (
    <>
      {/* Modal principal */}
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-4xl w-full max-h-[90vh] overflow-hidden transform animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-amber-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Mi Carrito</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!user ? (
                <div className="flex items-center justify-center h-full p-12">
                  <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <ShoppingCart className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Debes iniciar sesión</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Inicia sesión para ver tu carrito</p>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex items-center justify-center h-full p-12">
                  <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <ShoppingCart className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Tu carrito está vacío</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Agrega algunos productos de café para comenzar</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-y-auto h-full">
                  <div className="p-6 space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="bg-amber-50 dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image || "/placeholder.svg?height=80&width=80"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.product.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.product.category} - {item.product.brand}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Granulado: {item.product.grind}</p>
                            <p className="text-lg font-bold text-amber-900 dark:text-amber-300">${item.product.price.toFixed(2)}</p>
                          </div>

                          <div className="flex flex-col items-end space-y-3 flex-shrink-0">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                                className={`bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 text-amber-900 dark:text-gray-200 p-1 rounded-full transition-colors ${
                                  (loading || item.quantity <= 1) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>

                              <span className="font-bold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={loading}
                                className="bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 text-amber-900 dark:text-gray-200 p-1 rounded-full transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => confirmDelete(item.product.id)}
                                disabled={loading}
                                className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 p-1 rounded-full transition-colors ml-2 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-gray-100">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-6 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Total de productos:</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium text-gray-700 dark:text-gray-300">Total a pagar:</span>
                    <span className="text-2xl font-bold text-amber-900 dark:text-amber-300">${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Seguir comprando
                    </Button>
                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={loading}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Finalizar compra
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {productToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">¿Eliminar producto?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Estás seguro que deseas eliminar este producto de tu carrito?
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => setProductToDelete(null)}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRemoveItem}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}