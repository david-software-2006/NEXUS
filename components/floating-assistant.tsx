"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import AssistantModal from "./assistant-modal"

interface FloatingAssistantProps {
  user: any
}

export default function FloatingAssistant({ user }: FloatingAssistantProps) {
  const [showAssistant, setShowAssistant] = useState(false)

  if (!user) return null

  return (
    <>
      {/* Botón flotante del asistente */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowAssistant(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal del asistente */}
      {showAssistant && <AssistantModal onClose={() => setShowAssistant(false)} />}
    </>
  )
}
