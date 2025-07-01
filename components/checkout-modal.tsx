"use client"

import { useState, useEffect } from "react"
import { X, CreditCard, Banknote, Smartphone, ArrowLeft, Loader2, CheckCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { useRouter } from "next/navigation"

interface CheckoutModalProps {
  onClose: () => void
  onBack: () => void
  singleProduct?: {
    product: {
      id: string
      name: string
      price: number
    }
    quantity: number
  }
}

type PaymentMethod = "card" | "cash" | "transfer"

export default function CheckoutModal({ onClose, onBack, singleProduct }: CheckoutModalProps) {
  const { cart, user, processPurchase, clearCart } = useApp()
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [finalPaidAmount, setFinalPaidAmount] = useState(0)
  const router = useRouter()

  // Determinar si es compra individual o desde el carrito
  const isSinglePurchase = Boolean(singleProduct)
  const itemsToPurchase = isSinglePurchase ? [singleProduct!] : cart
  const totalPrice = itemsToPurchase.reduce((total, item) => total + (item.product.price * 4000 * item.quantity), 0)

  const paymentMethods = [
    { id: "card", name: "Tarjeta de Crédito/Débito", icon: CreditCard },
    { id: "cash", name: "Efectivo", icon: Banknote },
    { id: "transfer", name: "Transferencia Bancaria", icon: Smartphone },
  ]

  useEffect(() => {
    setError(null)
  }, [selectedPayment])

  const handlePurchase = async () => {
    if (!user) {
      setError("Debes iniciar sesión para realizar la compra")
      return
    }

    if (itemsToPurchase.length === 0) {
      setError("No hay productos para comprar")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const paymentMethodName = paymentMethods.find((p) => p.id === selectedPayment)?.name || "Tarjeta"
      
      // Procesar la compra
      const success = await processPurchase(paymentMethodName, isSinglePurchase ? itemsToPurchase : undefined)

      if (success) {
        setFinalPaidAmount(totalPrice)
        setShowSuccessModal(true)
        if (!isSinglePurchase) {
          clearCart()
        }
      } else {
        setError("Error procesando la compra. Por favor intenta nuevamente.")
      }
    } catch (err) {
      setError("Error de conexión. Por favor verifica tu conexión e intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    onClose()
  }

  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-amber-50 dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-md w-full transform animate-in zoom-in-95 duration-300 overflow-hidden border border-amber-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-amber-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">¡Compra exitosa!</h2>
            <p className="text-amber-700 dark:text-amber-200">Tu pedido ha sido procesado correctamente</p>
          </div>

          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                <span className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                  ¡Gracias por confiar en los emprendedores!
                </span>
                <Heart className="w-5 h-5 text-amber-600 dark:text-amber-300" />
              </div>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Tu apoyo hace la diferencia en nuestra comunidad de emprendedores.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-gray-700">
                <p className="text-sm text-amber-600 dark:text-amber-300 font-medium mb-2">Total pagado:</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  ${finalPaidAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
              <p>• Recibirás una confirmación por correo electrónico</p>
              <p>• El vendedor se contactará contigo pronto</p>
              <p>• Puedes ver tu compra en "Mis compras"</p>
            </div>
          </div>

          <div className="border-t border-amber-200 dark:border-gray-700 p-4 bg-amber-50 dark:bg-gray-800">
            <Button
              onClick={handleSuccessClose}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3"
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-md w-full transform animate-in zoom-in-95 duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              disabled={isProcessing}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isSinglePurchase ? "Comprar ahora" : "Finalizar compra"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6 p-4 bg-amber-50 dark:bg-gray-800 rounded-lg border border-amber-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Resumen del pedido</h3>
            <div className="space-y-3">
              {itemsToPurchase.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.product.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {item.quantity} × ${(item.product.price * 4000).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${(item.product.price * 4000 * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between font-bold">
              <span className="text-gray-900 dark:text-gray-100">Total:</span>
              <span className="text-amber-900 dark:text-amber-300">${totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Método de pago</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const isSelected = selectedPayment === method.id
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                    disabled={isProcessing}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    } ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-amber-600 dark:text-amber-300" : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-left flex-1 ${
                        isSelected ? "text-amber-900 dark:text-amber-100 font-medium" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {method.name}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 dark:bg-amber-400 border-2 border-white dark:border-gray-900 shadow-sm"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {user && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Información de contacto</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">Teléfono:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{user.phone || "No especificado"}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 sticky bottom-0 z-10">
          <div className="flex space-x-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isProcessing}
            >
              Volver
            </Button>
            <Button
              onClick={handlePurchase}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              disabled={isProcessing || itemsToPurchase.length === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar ${totalPrice.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}