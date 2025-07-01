"use client"

import { ArrowLeft, Package, User, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { useTheme } from "@/contexts/theme-context"
import Image from "next/image"

interface MySalesPageProps {
  onBack: () => void
}

export default function MySalesPage({ onBack }: MySalesPageProps) {
  const { theme } = useTheme()
  const { sales, user } = useApp()

  const mySales = sales.filter((sale) => sale.product.sellerId === user?.id)
  const totalRevenue = mySales.reduce((total, sale) => total + sale.totalPrice, 0)
  const totalItemsSold = mySales.reduce((total, sale) => total + sale.quantity, 0)

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
            Mis Ventas
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
                <Package className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Ventas
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  {mySales.length}
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
                  Ingresos Totales
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  ${totalRevenue.toFixed(2)}
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
                <Package className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Productos Vendidos
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  {totalItemsSold}
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
              Historial de Ventas
            </h2>
          </div>

          {mySales.length === 0 ? (
            <div className="p-12 text-center">
              <Package className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No tienes ventas aún
              </h3>
              <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                Cuando alguien compre tus productos, aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-amber-100'
            }`}>
              {mySales.map((sale) => (
                <div 
                  key={sale.id} 
                  className={`p-6 transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={sale.product.image || "/placeholder.svg"}
                        alt={sale.product.name}
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
                            {sale.product.name}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {sale.product.category} - {sale.product.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`}>
                            ${sale.totalPrice.toFixed(2)}
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Cantidad: {sale.quantity}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center space-x-4 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Comprador: {sale.buyer.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(sale.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{sale.paymentMethod}</span>
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