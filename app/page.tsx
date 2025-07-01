"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import NavigationBar from "@/components/navigation-bar"
import { Footer } from "@/components/footer" 
import ProductCard from "@/components/product-card"
import AuthModal from "@/components/auth-modal"
import CartModal from "@/components/cart-modal"
import MySalesPage from "@/components/my-sales-page"
import MyPurchasesPage from "@/components/my-purchases-page"
import MyProductsPage from "@/components/my-products-page"
import MyProfilePage from "@/components/my-profile-page"
import FloatingAssistant from "@/components/floating-assistant"
import { Coffee } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useTheme, ThemeProvider } from "@/contexts/theme-context"

// Create a wrapper component that provides the theme context
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

function HomeContent() {
  const { theme } = useTheme()
  const { user, products, loading, error, setError } = useApp()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [currentPage, setCurrentPage] = useState<"home" | "sales" | "purchases" | "products" | "profile">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    setError(null)
  }, [currentPage, setError])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = products.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesCategory = product.category.toLowerCase().includes(query)
        const matchesBrand = product.brand.toLowerCase().includes(query)
        const matchesPrice = (product.price * 4000).toString().includes(query)

        return matchesName || matchesCategory || matchesBrand || matchesPrice
      })
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  const handleLoginSuccess = () => {
    setShowAuthModal(false)
    setError(null)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "sales":
        return <MySalesPage onBack={() => setCurrentPage("home")} />
      case "purchases":
        return <MyPurchasesPage onBack={() => setCurrentPage("home")} />
      case "products":
        return <MyProductsPage onBack={() => setCurrentPage("home")} />
      case "profile":
        return <MyProfilePage onBack={() => setCurrentPage("home")} />
      default:
        return (
          <>
            {error && (
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className={`rounded-lg p-4 ${
                  theme === 'dark' 
                    ? 'bg-red-900/30 border-red-800 text-red-200' 
                    : 'bg-red-50 border-red-200 text-red-600'
                } border`}>
                  <p>{error}</p>
                  <button 
                    onClick={() => setError(null)} 
                    className={`text-sm mt-2 ${
                      theme === 'dark' ? 'text-red-300 underline' : 'text-red-800 underline'
                    }`}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            <div className="w-full px-4 py-8">
              <div className={`rounded-2xl shadow-2xl p-12 min-h-[350px] transform perspective-1000 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 shadow-gray-900/30' 
                  : 'bg-gradient-to-r from-[#532D1C] to-[#7A4930] shadow-amber-900/30'
              }`} style={{
                boxShadow: theme === 'dark' 
                  ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.05)'
                  : '0 20px 40px rgba(83, 45, 28, 0.3), 0 8px 16px rgba(83, 45, 28, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-12 h-full">
                  <div className="flex-shrink-0 w-48 h-48 hidden md:block">
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src="images/acerca_nosotros.jpeg" 
                        alt="NEXUS - Plataforma Cafetera" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className={`text-4xl font-bold mb-8 ${
                      theme === 'dark' ? 'text-amber-200' : 'text-amber-100'
                    }`}>
                      Bienvenido a NEXUS
                    </h2>
                    <p className={`mb-8 text-lg leading-relaxed text-justify ${
                      theme === 'dark' ? 'text-gray-300' : 'text-amber-50'
                    }`}>
                      Somos una plataforma que impulsa a nuevos emprendedores del mundo cafetero, 
                      brindándoles un espacio para ofrecer sus productos y darse a conocer. Aquí, productores, tostadores y marcas 
                      emergentes se conectan con una comunidad que valora el trabajo artesanal, la calidad y las historias que hay detrás 
                      de cada taza.
                    </p>
                    <p className={`text-base text-justify ${
                      theme === 'dark' ? 'text-amber-300' : 'text-amber-200'
                    }`}>
                      Explora nuestro catálogo y encuentra exactamente lo que necesitas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className={`text-4xl font-bold text-center mb-12 ${
                  theme === 'dark' ? 'text-amber-200' : 'text-amber-900'
                }`}>
                  Nuestros productos
                </h2>

                {searchQuery && (
                  <div className="text-center mb-8">
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {filteredProducts.length > 0
                        ? `Mostrando ${filteredProducts.length} resultado${filteredProducts.length !== 1 ? "s" : ""} para "${searchQuery}"`
                        : `No se encontraron resultados para "${searchQuery}"`}
                    </p>
                  </div>
                )}

                {filteredProducts.length === 0 && !searchQuery ? (
                  <div className="text-center py-12">
                    <Coffee className={`w-16 h-16 mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-xl font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Cargando productos...
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      Los productos aparecerán aquí en un momento.
                    </p>
                  </div>
                ) : filteredProducts.length === 0 && searchQuery ? (
                  <div className="text-center py-12">
                    <Coffee className={`w-16 h-16 mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-xl font-semibold mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      No se encontraron productos
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      Intenta con otros términos de búsqueda.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
            theme === 'dark' 
              ? 'border-amber-500 border-t-transparent' 
              : 'border-amber-600 border-t-transparent'
          }`}></div>
          <p className={theme === 'dark' ? 'text-amber-200 text-lg' : 'text-amber-900 text-lg'}>
            Cargando NEXUS...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden theme-transition ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-900'
    }`}>
      <Header onLoginClick={() => setShowAuthModal(true)} onNavigate={setCurrentPage} />

      <NavigationBar
        onCartClick={() => setShowCartModal(true)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {renderCurrentPage()}

      {currentPage === "home" && <Footer />}

      <FloatingAssistant user={user} />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />}

      {showCartModal && <CartModal onClose={() => setShowCartModal(false)} />}
    </div>
  )
}

// The main exported component that wraps the content with ThemeProvider
export default function HomePage() {
  return (
    <ThemeWrapper>
      <HomeContent />
    </ThemeWrapper>
  )
}