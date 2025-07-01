"use client"

import { ArrowLeft, ShoppingBag, User, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { useTheme } from "@/contexts/theme-context"
import Image from "next/image"

interface MyPurchasesPageProps {
  onBack: () => void
}

export default function MyPurchasesPage({ onBack }: MyPurchasesPageProps) {
  const { theme } = useTheme()
  const { purchases, user } = useApp()

  const myPurchases = purchases.filter((purchase) => purchase.sellerId !== user?.id)
  const totalSpent = myPurchases.reduce((total, purchase) => total + purchase.totalPrice, 0)
  const totalItemsBought = myPurchases.reduce((total, purchase) => total + purchase.quantity, 0)

  // Función para generar claves únicas
  const generateUniqueKey = (purchase: any, index: number) => {
    return `${purchase.id}-${purchase.date}-${index}`
  }

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center space-x-4 mb-8">
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
            Mis Compras
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-2xl shadow-lg p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-amber-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-amber-100'
              }`}>
                <ShoppingBag className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Compras
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  {myPurchases.length}
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
                theme === 'dark' ? 'bg-gray-700' : 'bg-red-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Gastado
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-700'
                }`}>
                  ${totalSpent.toFixed(2)}
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
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'
              }`}>
                <ShoppingBag className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Productos Comprados
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  {totalItemsBought}
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
              Historial de Compras
            </h2>
          </div>

          {myPurchases.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No tienes compras aún
              </h3>
              <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                Cuando compres productos, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-amber-100'
            }`}>
              {myPurchases.map((purchase, index) => (
                <div 
                  key={generateUniqueKey(purchase, index)} 
                  className={`p-6 transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={purchase.product.image || "/placeholder.svg"}
                        alt={purchase.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {purchase.product.name}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {purchase.product.category} - {purchase.product.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }`}>
                            ${purchase.totalPrice.toFixed(2)}
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Cantidad: {purchase.quantity}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center space-x-4 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Vendedor: {purchase.seller.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(purchase.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{purchase.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}