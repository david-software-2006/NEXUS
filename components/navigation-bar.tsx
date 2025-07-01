"use client"

import { Search, ShoppingCart, Package, CreditCard, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/app-context"

interface NavigationBarProps {
  onCartClick: () => void
  onNavigate: (page: "home" | "sales" | "purchases" | "products" | "profile") => void
  currentPage: string
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function NavigationBar({
  onCartClick,
  onNavigate,
  currentPage,
  searchQuery,
  onSearchChange,
}: NavigationBarProps) {
  const { user, cart } = useApp()

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  if (!user) return null

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Barra de búsqueda */}
          <div className="relative flex-1 max-w-md lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar cafés, categorías, precios..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-full border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 text-gray-800 bg-white/90 backdrop-blur-sm"
            />
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center space-x-2 flex-wrap justify-center lg:justify-end">
            <Button
              onClick={() => onNavigate("products")}
              className={`bg-amber-600/90 backdrop-blur-sm hover:bg-amber-700 text-white rounded-full px-4 py-2 transition-all duration-300 ${
                currentPage === "products" ? "bg-amber-800" : ""
              }`}
            >
              <Package className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Mis Productos</span>
            </Button>

            <Button
              onClick={() => onNavigate("sales")}
              className={`bg-amber-600/90 backdrop-blur-sm hover:bg-amber-700 text-white rounded-full px-4 py-2 transition-all duration-300 ${
                currentPage === "sales" ? "bg-amber-800" : ""
              }`}
            >
              <Package className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Mis Ventas</span>
            </Button>

            <Button
              onClick={() => onNavigate("purchases")}
              className={`bg-amber-600/90 backdrop-blur-sm hover:bg-amber-700 text-white rounded-full px-4 py-2 transition-all duration-300 ${
                currentPage === "purchases" ? "bg-amber-800" : ""
              }`}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Mis Compras</span>
            </Button>

            <Button
              onClick={onCartClick}
              className={`bg-amber-600/90 backdrop-blur-sm hover:bg-amber-700 text-white rounded-full px-4 py-2 transition-all duration-300 relative ${
                currentPage === "cart" ? "bg-amber-800" : ""
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Carrito</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button
              onClick={() => onNavigate("profile")}
              className={`bg-amber-600/90 backdrop-blur-sm hover:bg-amber-700 text-white rounded-full px-4 py-2 transition-all duration-300 ${
                currentPage === "profile" ? "bg-amber-800" : ""
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Mi Perfil</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
