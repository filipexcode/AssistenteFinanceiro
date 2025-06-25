import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"
import {
  budgetAnalyzerAgent,
  investmentSimulatorAgent,
  debtManagerAgent,
  financialPlannerAgent,
} from "@/lib/financial-agents"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: xai("grok-3-mini-beta"),
    system: `Você é um assistente financeiro especializado com agentes autônomos para análises avançadas.

AGENTES DISPONÍVEIS:
1. **Analisador de Orçamento**: Use quando o usuário mencionar renda e gastos
2. **Simulador de Investimentos**: Use para projeções e cenários de investimento
3. **Gestor de Dívidas**: Use quando o usuário tiver múltiplas dívidas
4. **Planejador Financeiro**: Use para objetivos de longo prazo e aposentadoria

QUANDO USAR OS AGENTES:
- Se o usuário fornecer dados específicos (valores, prazos, etc.), SEMPRE use o agente apropriado
- Combine análises dos agentes com seus conselhos personalizados
- Explique os resultados dos agentes de forma clara e prática

DIRETRIZES:
- Sempre forneça conselhos práticos e aplicáveis
- Use linguagem clara e acessível
- Foque na educação financeira
- Seja empático e compreensivo
- Use exemplos práticos quando possível

Responda sempre em português brasileiro de forma amigável e profissional.`,
    messages,
    tools: {
      budgetAnalyzer: budgetAnalyzerAgent,
      investmentSimulator: investmentSimulatorAgent,
      debtManager: debtManagerAgent,
      financialPlanner: financialPlannerAgent,
    },
  })

  return result.toDataStreamResponse()
}
