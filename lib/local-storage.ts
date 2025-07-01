// Servicio de LocalStorage para manejar todos los datos de la aplicación

export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  password: string
  createdAt: string
}

export interface Product {
  id: number
  name: string
  image: string
  price: number
  category: string
  brand: string
  grind: string
  description: string
  sellerId: number
  stock: number // Nueva propiedad para el stock
  createdAt: string
}

export interface CartItem {
  productId: number
  quantity: number
  addedAt: string
}

export interface Transaction {
  id: number
  productId: number
  sellerId: number
  buyerId: number
  quantity: number
  unitPrice: number
  totalPrice: number
  paymentMethod: string
  date: string
}

class LocalStorageService {
  private readonly USERS_KEY = "brioso_users"
  private readonly PRODUCTS_KEY = "brioso_products"
  private readonly CART_KEY = "brioso_cart"
  private readonly TRANSACTIONS_KEY = "brioso_transactions"
  private readonly CURRENT_USER_KEY = "brioso_current_user"

  // Inicializar datos de ejemplo si no existen
  initializeData() {
    if (!this.getUsers().length) {
      this.setUsers(this.getDefaultUsers())
    }
    if (!this.getProducts().length) {
      this.setProducts(this.getDefaultProducts())
    }
  }

  // Usuarios
  getUsers(): User[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  setUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  addUser(user: Omit<User, "id" | "createdAt">): User {
    const users = this.getUsers()
    const newUser: User = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    this.setUsers(users)
    return newUser
  }

  updateUser(userId: number, updates: Partial<User>): User | null {
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    this.setUsers(users)
    return users[userIndex]
  }

  getUserByEmail(email: string): User | null {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  }

  getUserById(id: number): User | null {
    return this.getUsers().find((u) => u.id === id) || null
  }

  // Productos
  getProducts(): Product[] {
    try {
      const products = localStorage.getItem(this.PRODUCTS_KEY)
      return products ? JSON.parse(products) : []
    } catch {
      return []
    }
  }

  setProducts(products: Product[]): void {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products))
  }

  addProduct(product: Omit<Product, "id" | "createdAt">): Product {
    const products = this.getProducts()
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    products.push(newProduct)
    this.setProducts(products)
    return newProduct
  }

  updateProduct(productId: number, updates: Partial<Product>): Product | null {
    const products = this.getProducts()
    const productIndex = products.findIndex((p) => p.id === productId)
    if (productIndex === -1) return null

    products[productIndex] = { ...products[productIndex], ...updates }
    this.setProducts(products)
    return products[productIndex]
  }

  // Nuevo método para actualizar solo el stock
  updateProductStock(productId: number, newStock: number): Product | null {
    const products = this.getProducts()
    const productIndex = products.findIndex((p) => p.id === productId)
    if (productIndex === -1) return null

    products[productIndex].stock = newStock
    this.setProducts(products)
    return products[productIndex]
  }

  // Método para reducir stock después de una compra
  reduceStock(productId: number, quantity: number): { success: boolean; message: string; product?: Product } {
    const products = this.getProducts()
    const productIndex = products.findIndex((p) => p.id === productId)
    
    if (productIndex === -1) {
      return { success: false, message: "Producto no encontrado" }
    }

    const product = products[productIndex]
    
    if (product.stock < quantity) {
      return { 
        success: false, 
        message: `Stock insuficiente. Solo quedan ${product.stock} unidades disponibles` 
      }
    }

    product.stock -= quantity
    this.setProducts(products)
    
    return { 
      success: true, 
      message: "Stock actualizado correctamente", 
      product: product 
    }
  }

  // Método para verificar disponibilidad de stock
  checkStock(productId: number, quantity: number): { available: boolean; currentStock: number } {
    const product = this.getProductById(productId)
    
    if (!product) {
      return { available: false, currentStock: 0 }
    }

    return {
      available: product.stock >= quantity,
      currentStock: product.stock
    }
  }

  deleteProduct(productId: number): boolean {
    const products = this.getProducts()
    const filteredProducts = products.filter((p) => p.id !== productId)

    if (filteredProducts.length === products.length) {
      return false // Product not found
    }

    this.setProducts(filteredProducts)

    // Also remove from all carts
    const users = this.getUsers()
    users.forEach((user) => {
      const cart = this.getCart(user.id)
      const filteredCart = cart.filter((item) => item.productId !== productId)
      this.setCart(user.id, filteredCart)
    })

    return true
  }

  getProductById(id: number): Product | null {
    return this.getProducts().find((p) => p.id === id) || null
  }

  getProductsBySeller(sellerId: number): Product[] {
    return this.getProducts().filter((p) => p.sellerId === sellerId)
  }

  // Método para obtener productos con stock disponible
  getAvailableProducts(): Product[] {
    return this.getProducts().filter((p) => p.stock > 0)
  }

  // Método para obtener productos con stock bajo (menos de 5 unidades)
  getLowStockProducts(): Product[] {
    return this.getProducts().filter((p) => p.stock <= 5 && p.stock > 0)
  }

  // Método para obtener productos sin stock
  getOutOfStockProducts(): Product[] {
    return this.getProducts().filter((p) => p.stock === 0)
  }

  // Carrito
  getCart(userId: number): CartItem[] {
    try {
      const cart = localStorage.getItem(`${this.CART_KEY}_${userId}`)
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  }

  setCart(userId: number, cart: CartItem[]): void {
    localStorage.setItem(`${this.CART_KEY}_${userId}`, JSON.stringify(cart))
  }

  // Método mejorado para agregar al carrito con verificación de stock
  addToCart(userId: number, productId: number, quantity: number): { success: boolean; message: string } {
    const stockCheck = this.checkStock(productId, quantity)
    
    if (!stockCheck.available) {
      return {
        success: false,
        message: `No hay suficiente stock. Solo quedan ${stockCheck.currentStock} unidades disponibles`
      }
    }

    const cart = this.getCart(userId)
    const existingItem = cart.find((item) => item.productId === productId)

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      const newStockCheck = this.checkStock(productId, newQuantity)
      
      if (!newStockCheck.available) {
        return {
          success: false,
          message: `No hay suficiente stock. Solo quedan ${newStockCheck.currentStock} unidades disponibles y ya tienes ${existingItem.quantity} en tu carrito`
        }
      }
      
      existingItem.quantity = newQuantity
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      })
    }

    this.setCart(userId, cart)
    return { success: true, message: "Producto agregado al carrito correctamente" }
  }

  removeFromCart(userId: number, productId: number): void {
    const cart = this.getCart(userId)
    const filteredCart = cart.filter((item) => item.productId !== productId)
    this.setCart(userId, filteredCart)
  }

  clearCart(userId: number): void {
    this.setCart(userId, [])
  }

  // Método para procesar una compra completa del carrito
  processCartPurchase(userId: number, paymentMethod: string): { success: boolean; message: string; failedItems?: string[] } {
    const cart = this.getCart(userId)
    
    if (cart.length === 0) {
      return { success: false, message: "El carrito está vacío" }
    }

    const failedItems: string[] = []
    const successfulTransactions: Transaction[] = []

    // Verificar stock de todos los productos antes de procesar
    for (const item of cart) {
      const stockCheck = this.checkStock(item.productId, item.quantity)
      if (!stockCheck.available) {
        const product = this.getProductById(item.productId)
        failedItems.push(`${product?.name || 'Producto desconocido'} (Stock insuficiente: ${stockCheck.currentStock} disponibles, ${item.quantity} solicitados)`)
      }
    }

    if (failedItems.length > 0) {
      return {
        success: false,
        message: "Algunos productos no tienen stock suficiente",
        failedItems
      }
    }

    // Procesar cada item del carrito
    for (const item of cart) {
      const product = this.getProductById(item.productId)
      if (!product) continue

      const stockResult = this.reduceStock(item.productId, item.quantity)
      
      if (stockResult.success) {
        const transaction = this.addTransaction({
          productId: item.productId,
          sellerId: product.sellerId,
          buyerId: userId,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: product.price * item.quantity,
          paymentMethod
        })
        successfulTransactions.push(transaction)
      } else {
        failedItems.push(`${product.name}: ${stockResult.message}`)
      }
    }

    if (failedItems.length === 0) {
      this.clearCart(userId)
      return { success: true, message: `Compra procesada exitosamente. ${successfulTransactions.length} productos comprados.` }
    } else {
      return {
        success: false,
        message: "Algunos productos no pudieron ser procesados",
        failedItems
      }
    }
  }

  // Transacciones
  getTransactions(): Transaction[] {
    try {
      const transactions = localStorage.getItem(this.TRANSACTIONS_KEY)
      return transactions ? JSON.parse(transactions) : []
    } catch {
      return []
    }
  }

  setTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions))
  }

  addTransaction(transaction: Omit<Transaction, "id" | "date">): Transaction {
    const transactions = this.getTransactions()
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    transactions.push(newTransaction)
    this.setTransactions(transactions)
    return newTransaction
  }

  getSalesByUser(sellerId: number): Transaction[] {
    return this.getTransactions().filter((t) => t.sellerId === sellerId)
  }

  getPurchasesByUser(buyerId: number): Transaction[] {
    return this.getTransactions().filter((t) => t.buyerId === buyerId)
  }

  // Usuario actual
  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY)
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY)
    }
  }

  // Datos por defecto - PRECIOS EN PESOS COLOMBIANOS
  private getDefaultUsers(): User[] {
    return [
      {
        id: 1,
        name: "NEXUS Admin",
        email: "admin@nexus.com",
        password: "admin123",
        phone: "555-0100",
        address: "Sede Principal NEXUS, Ciudad Central",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Juan Pérez",
        email: "juan.perez@email.com",
        password: "password123",
        phone: "555-0123",
        address: "Calle Principal 123, Zona Norte",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "María García",
        email: "maria.garcia@email.com",
        password: "password123",
        phone: "555-0124",
        address: "Avenida Central 456, Centro",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Carlos López",
        email: "carlos.lopez@email.com",
        password: "password123",
        phone: "555-0125",
        address: "Plaza Mayor 789, Zona Sur",
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date().toISOString(),
      },
    ]
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Mezcla Café Premium",
        price: 25.99,
        category: "Mezcla",
        brand: "NEXUS",
        grind: "Molido Medio",
        description: "Café premium de alta calidad con notas dulces y afrutadas. Perfecto para cualquier momento del día.",
        image: "/images/mezcla.png",
        sellerId: 1,
        stock: 50, // Stock inicial
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Arábica Premium",
        price: 32.5,
        category: "Arábica",
        brand: "Premium",
        grind: "Grano Entero",
        description: "Café arábica de origen único con sabor suave y aromático. Cultivado en las montañas de Colombia.",
        image: "/images/arabica.png",
        sellerId: 1,
        stock: 30,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Espresso Italiano",
        price: 28.75,
        category: "Espresso",
        brand: "Italian",
        grind: "Molido Fino",
        description: "Espresso tradicional italiano con cuerpo intenso y crema perfecta. Ideal para máquinas de espresso.",
        image: "/images/italiano.png",
        sellerId: 1,
        stock: 25,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: "Café Francés",
        price: 30.0,
        category: "Tostado Oscuro",
        brand: "French",
        grind: "Molido Medio",
        description: "Tostado francés con sabor intenso y robusto. Notas ahumadas y chocolate amargo.",
        image: "/images/frances.png",
        sellerId: 2,
        stock: 40,
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: "Descafeinado Suave",
        price: 22.99,
        category: "Descafeinado",
        brand: "Decaf",
        grind: "Molido Medio",
        description: "Café descafeinado que mantiene todo el sabor original. Proceso natural sin químicos.",
        image: "/images/descafeinado.png",
        sellerId: 2,
        stock: 35,
        createdAt: new Date().toISOString(),
      },
      {
        id: 6,
        name: "Tostado Claro",
        price: 26.5,
        category: "Tostado Claro",
        brand: "Light",
        grind: "Grano Entero",
        description: "Tostado claro con notas florales y cítricas. Acidez brillante y sabor delicado.",
        image: "/images/tostado_claro.png",
        sellerId: 3,
        stock: 20,
        createdAt: new Date().toISOString(),
      },
      {
        id: 7,
        name: "Orgánico Premium",
        price: 35.0,
        category: "Orgánico",
        brand: "Organic",
        grind: "Molido Grueso",
        description: "Café orgánico certificado de comercio justo. Cultivado sin pesticidas ni fertilizantes químicos.",
        image: "/images/organico.png",
        sellerId: 3,
        stock: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: 8,
        name: "Tostado Oscuro",
        price: 29.99,
        category: "Tostado Oscuro",
        brand: "Dark",
        grind: "Molido Fino",
        description: "Tostado oscuro con sabor intenso y notas ahumadas. Perfecto para los amantes del café fuerte.",
        image: "/images/tostado.png",
        sellerId: 4,
        stock: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: 9,
        name: "Café de Taza",
        price: 24.5,
        category: "Premium",
        brand: "Cup",
        grind: "Molido Medio",
        description: "Café premium perfecto para cualquier momento del día. Equilibrio perfecto entre sabor y aroma.",
        image: "/images/tasa.png",
        sellerId: 4,
        stock: 60,
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

export const localStorageService = new LocalStorageService()