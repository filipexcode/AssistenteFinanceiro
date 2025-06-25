"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, Send, Loader2 } from "lucide-react"
import { CurrencyRates } from "@/components/currency-rates"
import { AgentsPanel } from "@/components/agents-panel"

export default function FinancialAdvisorChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat()
  const [isTyping, setIsTyping] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsTyping(true)
    handleSubmit(e).finally(() => setIsTyping(false))
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
    setTimeout(() => {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>
      handleSubmit(syntheticEvent)
    }, 100)
  }

  const suggestedQuestions = [
    "Como criar um orçamento mensal?",
    "Melhor forma de quitar dívidas?",
    "Investir com pouco dinheiro?",
    "Dicas para economizar?",
    "Poupança vs investimentos?",
    "Reserva de emergência?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Assistente Financeiro</h1>
          </div>
          <p className="text-gray-600">Seu consultor pessoal para economia, investimentos e gestão de dívidas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Principal */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Chat Financeiro
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <DollarSign className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Olá! Sou seu assistente financeiro</h3>
                        <p className="text-gray-600 mb-6">
                          Estou aqui para ajudar você com suas finanças pessoais. Posso dar dicas sobre economia,
                          investimentos e gestão de dívidas.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-w-4xl mx-auto">
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="text-left h-auto p-4 bg-white text-gray-700 hover:bg-green-50 text-sm leading-relaxed whitespace-normal"
                            onClick={() => handleQuestionClick(question)}
                          >
                            <span className="block">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={message.role === "user" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}
                          >
                            {message.role === "user" ? "U" : "FA"}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(isLoading || isTyping) && (
                    <div className="flex justify-start mb-4">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-600 text-white">FA</AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-gray-600">Analisando sua pergunta...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              <CardFooter className="border-t bg-gray-50">
                <form onSubmit={onSubmit} className="flex w-full gap-2">
                  <Input
                    name="prompt"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Digite sua pergunta sobre finanças..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar com Cotações e Agentes */}
          <div className="lg:col-span-1 space-y-6">
            <CurrencyRates />
            <AgentsPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            💡 Lembre-se: Este assistente oferece orientações gerais. Para decisões importantes, consulte um
            profissional qualificado.
          </p>
        </div>
      </div>
    </div>
  )
}
