"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, Coffee, User, Bot, Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/app-context"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AssistantModalProps {
  onClose: () => void
}

export default function AssistantModal({ onClose }: AssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "¡Hola! Soy tu asistente inteligente de NEXUS. Puedo responder cualquier pregunta sobre la plataforma, productos, precios, ayudarte a navegar, agregar productos al carrito y mucho más. ¿En qué puedo ayudarte?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const { products, addToCart, user, sales, purchases, cart } = useApp()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "es-ES"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // IA INTELIGENTE Y VARIADA
  const getSmartResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase()

    // Respuestas variadas para saludos
    const greetings = [
      `¡Hola${user ? ` ${user.name}` : ""}! 👋 ¿En qué puedo ayudarte hoy?`,
      `¡Qué tal${user ? ` ${user.name}` : ""}! 😊 Estoy aquí para ayudarte con lo que necesites.`,
      `¡Bienvenido${user ? ` de nuevo, ${user.name}` : ""}! ¿Cómo puedo asistirte?`,
      `¡Hola! Soy tu asistente de NEXUS. ¿Qué te gustaría saber?`,
    ]

    if (lowerMessage.includes("hola") || lowerMessage.includes("buenos") || lowerMessage.includes("buenas")) {
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    // Preguntas sobre productos específicos
    if (lowerMessage.includes("cuántos productos") || lowerMessage.includes("cuantos productos")) {
      return `Actualmente tenemos ${products.length} productos disponibles en NEXUS. Desde cafés arábica premium hasta espressos italianos y mezclas especiales. ¿Te interesa alguna categoría en particular?`
    }

    // Información detallada de productos
    if (
      lowerMessage.includes("qué productos") ||
      lowerMessage.includes("que productos") ||
      lowerMessage.includes("catálogo")
    ) {
      const categories = [...new Set(products.map((p) => p.category))]
      const brands = [...new Set(products.map((p) => p.brand))]
      return `Tenemos una gran variedad de cafés:

📋 **Categorías**: ${categories.join(", ")}
🏷️ **Marcas**: ${brands.join(", ")}
💰 **Precios**: Desde $${Math.min(...products.map((p) => p.price * 4000)).toLocaleString()} COP hasta $${Math.max(...products.map((p) => p.price * 4000)).toLocaleString()} COP

¿Te interesa alguna categoría específica?`
    }

    // Precios específicos con variaciones
    if (lowerMessage.includes("precio") || lowerMessage.includes("cuesta") || lowerMessage.includes("vale")) {
      const productFound = products.find(
        (product) =>
          lowerMessage.includes(product.name.toLowerCase()) ||
          lowerMessage.includes(product.category.toLowerCase()) ||
          lowerMessage.includes(product.brand.toLowerCase()),
      )

      if (productFound) {
        const responses = [
          `El ${productFound.name} tiene un precio de $${(productFound.price * 4000).toLocaleString()} COP. Es de la categoría ${productFound.category} y marca ${productFound.brand}.`,
          `${productFound.name} cuesta $${(productFound.price * 4000).toLocaleString()} COP. Es un excelente café ${productFound.category} con granulado ${productFound.grind}.`,
          `El precio del ${productFound.name} es $${(productFound.price * 4000).toLocaleString()} COP. Vendido por ${productFound.seller.name}. ¿Te gustaría agregarlo al carrito?`,
        ]
        return responses[Math.floor(Math.random() * responses.length)]
      } else {
        return `No encontré el producto específico que mencionas. Nuestros precios van desde $${Math.min(...products.map((p) => p.price * 4000)).toLocaleString()} COP hasta $${Math.max(...products.map((p) => p.price * 4000)).toLocaleString()} COP. ¿Podrías ser más específico sobre qué producto te interesa?`
      }
    }

    // Comandos de carrito con respuestas variadas
    if (lowerMessage.includes("agregar") && lowerMessage.includes("carrito")) {
      if (!user) {
        return "Para agregar productos al carrito necesitas estar logueado. Haz clic en 'Iniciar Sesión' en la parte superior derecha del header."
      }

      const productFound = products.find(
        (product) =>
          lowerMessage.includes(product.name.toLowerCase()) ||
          lowerMessage.includes(product.category.toLowerCase()) ||
          lowerMessage.includes(product.brand.toLowerCase()),
      )

      if (productFound) {
        const success = await addToCart(productFound, 1)
        if (success) {
          const responses = [
            `¡Excelente elección! He agregado ${productFound.name} a tu carrito por $${(productFound.price * 4000).toLocaleString()} COP. 🛒`,
            `¡Listo! ${productFound.name} ya está en tu carrito. Precio: $${(productFound.price * 4000).toLocaleString()} COP. ¿Quieres agregar algo más?`,
            `¡Perfecto! ${productFound.name} agregado exitosamente. Total del producto: $${(productFound.price * 4000).toLocaleString()} COP. Puedes ver tu carrito en la barra de navegación.`,
          ]
          return responses[Math.floor(Math.random() * responses.length)]
        } else {
          return "Hubo un problema al agregar el producto. Por favor intenta nuevamente o verifica que estés logueado."
        }
      } else {
        return `No pude identificar el producto que quieres agregar. Tenemos: ${products
          .slice(0, 3)
          .map((p) => p.name)
          .join(", ")} y más. ¿Podrías ser más específico?`
      }
    }

    // Estadísticas del usuario con detalles
    if (
      lowerMessage.includes("mis ventas") ||
      lowerMessage.includes("cuánto he vendido") ||
      lowerMessage.includes("cuanto he vendido")
    ) {
      if (!user) return "Necesitas iniciar sesión para ver tus estadísticas de ventas."
      const userSales = sales.filter((sale) => sale.product.sellerId === user.id)
      const totalRevenue = userSales.reduce((total, sale) => total + sale.totalPrice, 0)
      const totalItems = userSales.reduce((total, sale) => total + sale.quantity, 0)

      if (userSales.length === 0) {
        return "Aún no has realizado ninguna venta. ¡Agrega productos en 'Mis Productos' para comenzar a vender!"
      }

      return `📊 **Resumen de tus ventas:**
• Total de ventas: ${userSales.length}
• Productos vendidos: ${totalItems} unidades
• Ingresos totales: $${totalRevenue.toLocaleString()} COP
• Promedio por venta: $${Math.round(totalRevenue / userSales.length).toLocaleString()} COP

Ve a 'Mis Ventas' para ver el detalle completo.`
    }

    if (
      lowerMessage.includes("mis compras") ||
      lowerMessage.includes("qué he comprado") ||
      lowerMessage.includes("que he comprado")
    ) {
      if (!user) return "Necesitas iniciar sesión para ver tu historial de compras."
      const userPurchases = purchases.filter((purchase) => purchase.sellerId !== user.id)
      const totalSpent = userPurchases.reduce((total, purchase) => total + purchase.totalPrice, 0)
      const totalItems = userPurchases.reduce((total, purchase) => total + purchase.quantity, 0)

      if (userPurchases.length === 0) {
        return "Aún no has realizado ninguna compra. ¡Explora nuestros productos y encuentra tu café favorito!"
      }

      return `🛍️ **Resumen de tus compras:**
• Total de compras: ${userPurchases.length}
• Productos comprados: ${totalItems} unidades
• Total gastado: $${totalSpent.toLocaleString()} COP
• Promedio por compra: $${Math.round(totalSpent / userPurchases.length).toLocaleString()} COP

Ve a 'Mis Compras' para ver todos los detalles.`
    }

    // Estado del carrito
    if (
      lowerMessage.includes("carrito") ||
      lowerMessage.includes("qué tengo en el carrito") ||
      lowerMessage.includes("que tengo en el carrito")
    ) {
      if (!user) return "Necesitas iniciar sesión para ver tu carrito."
      if (cart.length === 0) return "Tu carrito está vacío. ¡Agrega algunos deliciosos cafés para comenzar!"

      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      const totalPrice = cart.reduce((total, item) => total + item.product.price * 4000 * item.quantity, 0)
      const productNames = cart.map((item) => `${item.product.name} (${item.quantity})`).join(", ")

      return `🛒 **Tu carrito contiene:**
• ${totalItems} productos: ${productNames}
• Total a pagar: $${totalPrice.toLocaleString()} COP

¿Quieres proceder al checkout o agregar más productos?`
    }

    // Navegación con instrucciones específicas
    if (lowerMessage.includes("ir a") || lowerMessage.includes("navegar") || lowerMessage.includes("abrir")) {
      if (lowerMessage.includes("productos") || lowerMessage.includes("mis productos")) {
        return "Para ir a 'Mis Productos': Busca la barra de navegación debajo del header (donde está el buscador) y haz clic en el botón 'Mis Productos' 📦. Ahí puedes agregar, editar y eliminar tus productos para vender."
      }
      if (lowerMessage.includes("ventas") || lowerMessage.includes("mis ventas")) {
        return "Para ver 'Mis Ventas': En la barra de navegación (debajo del header), haz clic en 'Mis Ventas' 📊. Ahí verás todas las ventas que has realizado con detalles completos."
      }
      if (lowerMessage.includes("compras") || lowerMessage.includes("mis compras")) {
        return "Para ver 'Mis Compras': En la barra de navegación, haz clic en 'Mis Compras' 💳. Ahí encontrarás todo tu historial de compras."
      }
      if (lowerMessage.includes("perfil")) {
        return "Para ir a tu perfil: Haz clic en 'Mi Perfil' 👤 en la barra de navegación. Ahí puedes editar tu información personal, cambiar tu foto y actualizar tus datos."
      }
    }

    // Cómo usar la plataforma
    if (lowerMessage.includes("cómo comprar") || lowerMessage.includes("como comprar")) {
      return `🛒 **Guía para comprar:**

1️⃣ **Busca** el producto usando el buscador
2️⃣ **Haz clic** en la card del producto para voltearla
3️⃣ **En la parte trasera**, verás toda la información
4️⃣ **Haz clic en 'Comprar'** (botón verde)
5️⃣ **Selecciona** tu método de pago preferido
6️⃣ **Confirma** la compra

¡También puedes agregarlo al carrito primero si quieres comprar varios productos juntos!`
    }

    if (lowerMessage.includes("cómo vender") || lowerMessage.includes("como vender")) {
      return `💰 **Guía para vender:**

1️⃣ Ve a **'Mis Productos'** en la barra de navegación
2️⃣ Haz clic en **'Agregar Producto'**
3️⃣ Completa la información:
   • Nombre del café
   • Precio en COP
   • Categoría (Arábica, Espresso, etc.)
   • Marca
   • Tipo de granulado
   • Descripción
4️⃣ **Sube una imagen** atractiva
5️⃣ **Guarda** el producto

¡Tu producto aparecerá inmediatamente en la tienda para que otros lo compren!`
    }

    // Búsqueda y filtros
    if (
      lowerMessage.includes("cómo buscar") ||
      lowerMessage.includes("como buscar") ||
      lowerMessage.includes("buscar")
    ) {
      return `🔍 **Cómo usar el buscador:**

El buscador está en la barra de navegación (debajo del header). Puedes buscar por:

• **Nombre**: "arábica", "espresso"
• **Categoría**: "tostado oscuro", "descafeinado"
• **Marca**: "Juan Valdez", "Starbucks"
• **Precio**: "100000", "130000"

¡El buscador es muy inteligente y encuentra resultados parciales también!`
    }

    // Información sobre café
    if (lowerMessage.includes("diferencia") && (lowerMessage.includes("arábica") || lowerMessage.includes("robusta"))) {
      return `☕ **Diferencias entre Arábica y Robusta:**

🌟 **Arábica:**
• Sabor más suave y dulce
• Menos cafeína
• Notas afrutadas y florales
• Más caro pero mejor calidad

💪 **Robusta:**
• Sabor más fuerte y amargo
• Más cafeína
• Notas terrosas
• Más económico y resistente

En NEXUS tenemos principalmente Arábica premium para la mejor experiencia.`
    }

    // Métodos de pago
    if (lowerMessage.includes("método") && lowerMessage.includes("pago")) {
      return `💳 **Métodos de pago disponibles:**

• **Tarjeta** 💳: Crédito o débito
• **Efectivo** 💵: Pago en efectivo
• **Transferencia** 📱: Transferencia bancaria

Puedes seleccionar tu método preferido al momento de comprar en la parte trasera de cada producto.`
    }

    // Respuestas sobre la empresa
    if (
      lowerMessage.includes("qué es nexus") ||
      lowerMessage.includes("que es nexus") ||
      lowerMessage.includes("sobre nexus")
    ) {
      return `☕ **Sobre NEXUS:**

NEXUS es una plataforma premium de café donde conectamos a amantes del café con productores y vendedores locales. 

🎯 **Nuestra misión**: Ofrecer la mejor experiencia de café online
🌟 **Nuestra visión**: Ser la plataforma líder en café premium
💎 **Nuestros valores**: Calidad, comunidad y pasión por el café

¡Únete a nuestra comunidad cafetera!`
    }

    // Agradecimientos
    if (lowerMessage.includes("gracias")) {
      const thanks = [
        "¡De nada! 😊 Estoy aquí para ayudarte con todo lo que necesites.",
        "¡Un placer ayudarte! ¿Hay algo más en lo que pueda asistirte?",
        "¡Para eso estoy! ¿Te gustaría saber algo más sobre NEXUS?",
        "¡Siempre a tu servicio! ¿Necesitas ayuda con algo más?",
      ]
      return thanks[Math.floor(Math.random() * thanks.length)]
    }

    // Respuesta inteligente por defecto
    const defaultResponses = [
      `Entiendo que preguntas sobre "${message}". Como asistente inteligente de NEXUS, puedo ayudarte con muchas cosas. ¿Podrías ser más específico?`,
      `Interesante pregunta sobre "${message}". ¿Te refieres a productos, precios, navegación o algo específico de la plataforma?`,
      `Veo que mencionas "${message}". ¿Podrías darme más detalles para poder ayudarte mejor?`,
    ]

    return (
      defaultResponses[Math.floor(Math.random() * defaultResponses.length)] +
      `

💡 **Puedo ayudarte con:**
• Información de productos y precios en COP
• Agregar productos al carrito
• Ver tus estadísticas (ventas/compras)
• Navegar por la plataforma
• Guías de uso (cómo comprar/vender)
• Información sobre café`
    )
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    try {
      const assistantResponse = await getSmartResponse(currentMessage)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      speakText(assistantResponse)
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Disculpa, hubo un error procesando tu pregunta. ¿Puedes intentar de nuevo?",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-[0_25px_50px_rgba(0,0,0,0.5)] max-w-2xl w-full h-[600px] flex flex-col transform animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-amber-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100">Asistente Inteligente NEXUS</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Respuestas inteligentes y personalizadas</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Detener voz"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.isUser 
                    ? "bg-amber-600 dark:bg-amber-700 text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && <Bot className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />}
                  {message.isUser && <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser 
                        ? "text-amber-100 dark:text-amber-200" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-amber-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta cualquier cosa: 'precio del arábica', 'mis ventas', 'cómo comprar'..."
              className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`px-4 ${
                isListening 
                  ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" 
                  : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              } text-white`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            {isListening ? "🎤 Escuchando..." : "Pregunta cualquier cosa • IA inteligente y personalizada"}
          </p>
        </div>
      </div>
    </div>
  )
}