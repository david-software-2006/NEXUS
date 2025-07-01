"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, User, Phone, CreditCard, Banknote, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddToCartModal from "./add-to-cart-modal"
import CheckoutModal from "./checkout-modal" // Cambié el nombre para coincidir con tu componente
import { useApp } from "@/contexts/app-context"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  name: string
  image: string
  price: number
  category: string
  brand: string
  grind: string
  sellerId: number
  stock: number
  description: string
  createdAt: string
  seller: {
    name: string
    phone: string
    avatar: string
  }
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const { user } = useApp()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleQuickPurchase = () => {
    if (!user) {
      alert("Debes iniciar sesión para comprar")
      return
    }
    setShowCheckoutModal(true)
  }

  return (
    <>
      <div className="relative h-96 perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${isFlipped ? "rotate-y-180" : ""
            }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card - SOLO CARRITO */}
          <div className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br from-amber-100 to-orange-100
            dark:bg-transparent dark:from-transparent dark:to-transparent
            dark:backdrop-blur-lg
            rounded-2xl 
            shadow-2xl dark:shadow-[0_10px_25px_rgba(0,0,0,0.30)]
            border border-amber-400
            overflow-hidden 
            group hover:shadow-3xl dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.45)]
            transition-all duration-300
          `}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCartModal(true)
              }}
              className="absolute top-4 right-4 z-10 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>

            <div className="p-6 h-full flex flex-col">
              <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                    {product.category}
                  </p>
                </div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card - CON BOTONES */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-amber-900 to-orange-900 rounded-2xl shadow-2xl text-white overflow-hidden">
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4">{product.name}</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-amber-200">Precio:</span>
                    <span className="font-bold">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200">Categoría:</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200">Marca:</span>
                    <span>{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200">Granulado:</span>
                    <span>{product.grind}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200">Stock:</span>
                    <span>{product.stock}</span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-amber-800/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={product.seller.avatar || "/placeholder.svg"}
                      alt={product.seller.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span className="font-semibold text-sm">{product.seller.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-amber-200">
                        <Phone className="w-3 h-3" />
                        <span>{product.seller.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones principales */}
              <div className="flex space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleQuickPurchase()
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Comprar
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCartModal(true)
                  }}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCartModal && <AddToCartModal product={product} onClose={() => setShowCartModal(false)} />}

      {showCheckoutModal && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          onBack={() => setShowCheckoutModal(false)}
          singleProduct={{
            product: {
              id: product.id.toString(),
              name: product.name,
              price: product.price
            },
            quantity: 1
          }}
        />
      )}
    </>
  )
}