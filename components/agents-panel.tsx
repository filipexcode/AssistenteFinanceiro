"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Calculator, Target, CreditCard, PiggyBank } from "lucide-react"

export function AgentsPanel() {
  const agents = [
    {
      name: "Analisador de Orçamento",
      icon: <Calculator className="h-4 w-4" />,
      description: "Analisa gastos e identifica oportunidades de economia",
      status: "ativo",
      color: "bg-blue-500",
    },
    {
      name: "Simulador de Investimentos",
      icon: <Target className="h-4 w-4" />,
      description: "Projeta cenários de investimento personalizados",
      status: "ativo",
      color: "bg-green-500",
    },
    {
      name: "Gestor de Dívidas",
      icon: <CreditCard className="h-4 w-4" />,
      description: "Otimiza estratégias de quitação de dívidas",
      status: "ativo",
      color: "bg-red-500",
    },
    {
      name: "Planejador Financeiro",
      icon: <PiggyBank className="h-4 w-4" />,
      description: "Cria planos para objetivos de longo prazo",
      status: "ativo",
      color: "bg-purple-500",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Agentes Autônomos
        </CardTitle>
        <p className="text-sm text-gray-600">Assistentes especializados ativos</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {agents.map((agent, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 rounded-full ${agent.color} text-white`}>{agent.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{agent.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {agent.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{agent.description}</p>
            </div>
          </div>
        ))}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          🤖 Agentes prontos para análises automáticas
        </div>
      </CardContent>
    </Card>
  )
}
