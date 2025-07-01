"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { localStorageService, type User, type Product } from "@/lib/local-storage"

interface ProductWithSeller extends Product {
  seller: {
    name: string
    phone: string
    avatar: string
  }
}

interface CartItem {
  product: ProductWithSeller
  quantity: number
}

interface Sale {
  id: number
  productId: number
  product: ProductWithSeller
  buyerId: number
  buyer: User
  quantity: number
  totalPrice: number
  date: string
  paymentMethod: string
}

interface Purchase {
  id: number
  productId: number
  product: ProductWithSeller
  sellerId: number
  seller: User
  quantity: number
  totalPrice: number
  date: string
  paymentMethod: string
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  products: ProductWithSeller[]
  cart: CartItem[]
  sales: Sale[]
  purchases: Purchase[]
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => Promise<void>
  loadUserData: () => Promise<void>
  loadProducts: () => Promise<void>
  loadCart: () => Promise<void>
  loadSales: () => Promise<void>
  loadPurchases: () => Promise<void>
  addToCart: (product: ProductWithSeller, quantity: number) => Promise<boolean>
  removeFromCart: (productId: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  addProduct: (productData: Omit<Product, 'id' | 'sellerId' | 'seller'>) => Promise<boolean>
  updateUser: (userData: Partial<User>) => Promise<boolean>
  processPurchase: (paymentMethod: string) => Promise<boolean>
  setError: (error: string | null) => void
  updateProduct: (productId: number, productData: Partial<Product>) => Promise<boolean>
  deleteProduct: (productId: number) => Promise<boolean>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<ProductWithSeller[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Inicializar datos al cargar la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar datos por defecto si no existen
        localStorageService.initializeData()

        // Cargar usuario actual del localStorage
        await loadUserData()

        // Cargar productos
        await loadProducts()
      } catch (error) {
        console.error("Error inicializando aplicación:", error)
        setError("Error cargando la aplicación")
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const loadUserData = useCallback(async () => {
    try {
      setError(null)
      const currentUser = localStorageService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        console.log("Usuario cargado desde localStorage:", currentUser.name)
      } else {
        setUser(null)
        console.log("No hay usuario en localStorage")
      }
    } catch (error) {
      console.error("Error cargando usuario:", error)
      setUser(null)
    }
  }, [])

  const loadProducts = useCallback(async () => {
    try {
      setError(null)
      const allProducts = localStorageService.getProducts()
      const allUsers = localStorageService.getUsers()

      const productsWithSellers: ProductWithSeller[] = allProducts.map((product) => {
        const seller = allUsers.find((u) => u.id === product.sellerId)
        return {
          ...product,
          seller: {
            name: seller?.name || "Vendedor",
            phone: seller?.phone || "No disponible",
            avatar: seller?.avatar || "/placeholder.svg?height=40&width=40",
          },
        }
      })

      setProducts(productsWithSellers)
    } catch (error) {
      console.error("Error cargando productos:", error)
      setError("Error cargando productos")
      setProducts([])
    }
  }, [])

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart([])
      return
    }

    try {
      setError(null)
      const cartItems = localStorageService.getCart(user.id)
      const allProducts = localStorageService.getProducts()
      const allUsers = localStorageService.getUsers()

      const cartWithProducts: CartItem[] = cartItems
        .map((item) => {
          const product = allProducts.find((p) => p.id === item.productId)
          const seller = allUsers.find((u) => u.id === product?.sellerId)

          if (!product) return null

          return {
            product: {
              ...product,
              seller: {
                name: seller?.name || "Vendedor",
                phone: seller?.phone || "No disponible",
                avatar: seller?.avatar || "/placeholder.svg?height=40&width=40",
              },
            },
            quantity: item.quantity,
          }
        })
        .filter(Boolean) as CartItem[]

      setCart(cartWithProducts)
    } catch (error) {
      console.error("Error cargando carrito:", error)
      setCart([])
    }
  }, [user])

  const loadSales = useCallback(async () => {
    if (!user) {
      setSales([])
      return
    }

    try {
      const transactions = localStorageService.getSalesByUser(user.id)
      const allProducts = localStorageService.getProducts()
      const allUsers = localStorageService.getUsers()

      const salesWithDetails: Sale[] = transactions
        .map((transaction) => {
          const product = allProducts.find((p) => p.id === transaction.productId)
          const buyer = allUsers.find((u) => u.id === transaction.buyerId)
          const seller = allUsers.find((u) => u.id === product?.sellerId)

          if (!product || !buyer) return null

          return {
            id: transaction.id,
            productId: transaction.productId,
            product: {
              ...product,
              seller: {
                name: seller?.name || "Vendedor",
                phone: seller?.phone || "No disponible",
                avatar: seller?.avatar || "/placeholder.svg?height=40&width=40",
              },
            },
            buyerId: transaction.buyerId,
            buyer,
            quantity: transaction.quantity,
            totalPrice: transaction.totalPrice,
            date: transaction.date,
            paymentMethod: transaction.paymentMethod,
          }
        })
        .filter(Boolean) as Sale[]

      setSales(salesWithDetails)
    } catch (error) {
      console.error("Error cargando ventas:", error)
      setSales([])
    }
  }, [user])

  const loadPurchases = useCallback(async () => {
    if (!user) {
      setPurchases([])
      return
    }

    try {
      const transactions = localStorageService.getPurchasesByUser(user.id)
      const allProducts = localStorageService.getProducts()
      const allUsers = localStorageService.getUsers()

      const purchasesWithDetails: Purchase[] = transactions
        .map((transaction) => {
          const product = allProducts.find((p) => p.id === transaction.productId)
          const seller = allUsers.find((u) => u.id === transaction.sellerId)

          if (!product || !seller) return null

          return {
            id: transaction.id,
            productId: transaction.productId,
            product: {
              ...product,
              seller: {
                name: seller?.name || "Vendedor",
                phone: seller?.phone || "No disponible",
                avatar: seller?.avatar || "/placeholder.svg?height=40&width=40",
              },
            },
            sellerId: transaction.sellerId,
            seller,
            quantity: transaction.quantity,
            totalPrice: transaction.totalPrice,
            date: transaction.date,
            paymentMethod: transaction.paymentMethod,
          }
        })
        .filter(Boolean) as Purchase[]

      setPurchases(purchasesWithDetails)
    } catch (error) {
      console.error("Error cargando compras:", error)
      setPurchases([])
    }
  }, [user])

  // Cargar datos adicionales cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      loadCart()
      loadSales()
      loadPurchases()
    } else {
      setCart([])
      setSales([])
      setPurchases([])
    }
  }, [user, loadCart, loadSales, loadPurchases])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null)

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Formato de email inválido")
        return false
      }

      const user = localStorageService.getUserByEmail(email)

      if (!user || user.password !== password) {
        setError("Email o contraseña incorrectos")
        return false
      }

      // Guardar usuario en localStorage y estado
      localStorageService.setCurrentUser(user)
      setUser(user)
      console.log("Usuario logueado exitosamente:", user.name)
      return true
    } catch (error) {
      console.error("Error en login:", error)
      setError("Error de conexión")
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      setError(null)

      const { name, email, password, phone, address } = userData

      // Validar campos requeridos (sin dirección)
      if (!name || !email || !password || !phone) {
        setError("Nombre, email, contraseña y teléfono son requeridos")
        return false
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Formato de email inválido")
        return false
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        return false
      }

      // Verificar si el usuario ya existe
      const existingUser = localStorageService.getUserByEmail(email)
      if (existingUser) {
        setError("Ya existe una cuenta con este email")
        return false
      }

      // Crear nuevo usuario (dirección opcional)
      const newUser = localStorageService.addUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone || "",
        address: address || "", // Opcional
        avatar: "/placeholder.svg?height=40&width=40",
      })

      // Guardar usuario en localStorage y estado
      localStorageService.setCurrentUser(newUser)
      setUser(newUser)
      console.log("Usuario registrado exitosamente:", newUser.name)
      return true
    } catch (error) {
      console.error("Error en registro:", error)
      setError("Error de conexión")
      return false
    }
  }

  const logout = async () => {
    try {
      localStorageService.setCurrentUser(null)
      setUser(null)
      setCart([])
      setSales([])
      setPurchases([])
      setError(null)
      console.log("Usuario deslogueado exitosamente")
    } catch (error) {
      console.error("Error en logout:", error)
    }
  }

  const addToCart = async (product: ProductWithSeller, quantity: number): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión para agregar productos al carrito")
      return false
    }

    if (quantity > product.stock) {
      setError(`No hay suficiente stock. Solo quedan ${product.stock} unidades.`)
      return false
    }

    try {
      setError(null)
      localStorageService.addToCart(user.id, product.id, quantity)
      
      // Actualizar el stock localmente
      const updatedProducts = products.map(p => 
        p.id === product.id ? {...p, stock: p.stock - quantity} : p
      )
      setProducts(updatedProducts)
      
      await loadCart()
      return true
    } catch (error) {
      console.error("Error agregando al carrito:", error)
      setError("Error agregando al carrito")
      return false
    }
  }

  const removeFromCart = async (productId: number): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión")
      return false
    }

    try {
      setError(null)
      const cartItem = cart.find(item => item.product.id === productId)
      
      if (cartItem) {
        // Restaurar el stock si se elimina del carrito
        const updatedProducts = products.map(p => 
          p.id === productId ? {...p, stock: p.stock + cartItem.quantity} : p
        )
        setProducts(updatedProducts)
      }
      
      localStorageService.removeFromCart(user.id, productId)
      await loadCart()
      return true
    } catch (error) {
      console.error("Error eliminando del carrito:", error)
      setError("Error eliminando del carrito")
      return false
    }
  }

  const clearCart = async (): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión")
      return false
    }

    try {
      setError(null)
      
      // Restaurar el stock de todos los productos en el carrito
      const updatedProducts = products.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id)
        return cartItem ? {...p, stock: p.stock + cartItem.quantity} : p
      })
      setProducts(updatedProducts)
      
      localStorageService.clearCart(user.id)
      setCart([])
      return true
    } catch (error) {
      console.error("Error limpiando carrito:", error)
      setError("Error limpiando carrito")
      return false
    }
  }

  const addProduct = async (productData: Omit<Product, 'id' | 'sellerId' | 'seller'>): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión para agregar productos")
      return false
    }

    try {
      setError(null)

      const { name, price, category, brand, grind, description, image, stock } = productData

      // Validar campos requeridos
      if (!name || !price || !category || !brand || !grind || stock === undefined) {
        setError("Todos los campos obligatorios deben ser completados")
        return false
      }

      // Validar precio
      const numPrice = Number.parseFloat(price.toString())
      if (isNaN(numPrice) || numPrice <= 0) {
        setError("El precio debe ser un número válido mayor a 0")
        return false
      }

      // Validar stock
      const numStock = Number.parseInt(stock.toString())
      if (isNaN(numStock) || numStock < 0) {
        setError("El stock debe ser un número válido mayor o igual a 0")
        return false
      }

      localStorageService.addProduct({
        name: name.trim(),
        price: numPrice,
        category: category.trim(),
        brand: brand.trim(),
        grind: grind.trim(),
        description: description || "",
        image: image || "/placeholder.svg?height=300&width=300",
        stock: numStock,
        sellerId: user.id,
      })

      await loadProducts()
      return true
    } catch (error) {
      console.error("Error agregando producto:", error)
      setError("Error agregando producto")
      return false
    }
  }

  const updateProduct = async (productId: number, productData: Partial<Product>): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión para actualizar productos")
      return false
    }

    try {
      setError(null)

      const { name, price, category, brand, grind, description, image, stock } = productData

      // Validar campos requeridos si están presentes
      if (name && name.trim() === "") {
        setError("El nombre no puede estar vacío")
        return false
      }

      if (price !== undefined) {
        const numPrice = Number.parseFloat(price.toString())
        if (isNaN(numPrice) || numPrice <= 0) {
          setError("El precio debe ser un número válido mayor a 0")
          return false
        }
      }

      if (stock !== undefined) {
        const numStock = Number.parseInt(stock.toString())
        if (isNaN(numStock) || numStock < 0) {
          setError("El stock debe ser un número válido mayor o igual a 0")
          return false
        }
      }

      const updatedProduct = localStorageService.updateProduct(productId, {
        ...(name && { name: name.trim() }),
        ...(price && { price: Number.parseFloat(price.toString()) }),
        ...(category && { category: category.trim() }),
        ...(brand && { brand: brand.trim() }),
        ...(grind && { grind: grind.trim() }),
        ...(description && { description }),
        ...(image && { image }),
        ...(stock !== undefined && { stock: Number.parseInt(stock.toString()) }),
      })

      if (updatedProduct) {
        await loadProducts()
        return true
      } else {
        setError("Producto no encontrado")
        return false
      }
    } catch (error) {
      console.error("Error actualizando producto:", error)
      setError("Error actualizando producto")
      return false
    }
  }

  const deleteProduct = async (productId: number): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión para eliminar productos")
      return false
    }

    try {
      setError(null)
      const success = localStorageService.deleteProduct(productId)

      if (success) {
        await loadProducts()
        await loadCart() // Recargar carrito en caso de que el producto eliminado estuviera ahí
        return true
      } else {
        setError("Producto no encontrado")
        return false
      }
    } catch (error) {
      console.error("Error eliminando producto:", error)
      setError("Error eliminando producto")
      return false
    }
  }

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión")
      return false
    }

    try {
      setError(null)

      const { name, email, phone, address, avatar } = userData

      // Validar campos requeridos (sin dirección)
      if (!name || !email) {
        setError("Nombre y email son requeridos")
        return false
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Formato de email inválido")
        return false
      }

      // Verificar si el email ya está en uso por otro usuario
      const existingUser = localStorageService.getUserByEmail(email)
      if (existingUser && existingUser.id !== user.id) {
        setError("Este email ya está en uso por otro usuario")
        return false
      }

      const updatedUser = localStorageService.updateUser(user.id, {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || "",
        address: address || "", // Opcional
        avatar: avatar || "/placeholder.svg?height=40&width=40",
      })

      if (updatedUser) {
        localStorageService.setCurrentUser(updatedUser)
        setUser(updatedUser)
        return true
      } else {
        setError("Error actualizando perfil")
        return false
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error)
      setError("Error actualizando perfil")
      return false
    }
  }

  const processPurchase = async (paymentMethod: string): Promise<boolean> => {
    if (!user) {
      setError("Debes iniciar sesión para realizar compras")
      return false
    }

    if (cart.length === 0) {
      setError("El carrito está vacío")
      return false
    }

    try {
      setError(null)

      // Verificar stock antes de procesar la compra
      for (const item of cart) {
        const product = products.find(p => p.id === item.product.id)
        if (!product || product.stock < item.quantity) {
          setError(`No hay suficiente stock para ${product?.name}`)
          return false
        }
      }

      // Procesar cada item del carrito
      for (const item of cart) {
        const totalPrice = item.product.price * item.quantity

        localStorageService.addTransaction({
          productId: item.product.id,
          sellerId: item.product.sellerId,
          buyerId: user.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice,
          paymentMethod,
        })

        // Actualizar stock en el producto
        localStorageService.updateProduct(item.product.id, {
          stock: item.product.stock - item.quantity
        })
      }

      // Limpiar el carrito después de la compra
      localStorageService.clearCart(user.id)

      // Recargar datos
      await loadProducts()
      await loadCart()
      await loadPurchases()
      await loadSales()

      return true
    } catch (error) {
      console.error("Error procesando compra:", error)
      setError("Error procesando compra")
      return false
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        products,
        cart,
        sales,
        purchases,
        loading,
        error,
        login,
        register,
        logout,
        loadUserData,
        loadProducts,
        loadCart,
        loadSales,
        loadPurchases,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        updateUser,
        processPurchase,
        setError,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}