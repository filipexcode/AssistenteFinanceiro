import { tool } from "ai"
import { z } from "zod"

// Agente de Análise de Orçamento
export const budgetAnalyzerAgent = tool({
  description: "Analisa orçamento pessoal e identifica oportunidades de economia",
  parameters: z.object({
    income: z.number().describe("Renda mensal"),
    expenses: z
      .array(
        z.object({
          category: z.string().describe("Categoria do gasto"),
          amount: z.number().describe("Valor gasto"),
        }),
      )
      .describe("Lista de gastos por categoria"),
  }),
  execute: async ({ income, expenses }) => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const savings = income - totalExpenses
    const savingsRate = (savings / income) * 100

    // Análise por categoria
    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Identifica categorias com gastos altos
    const highExpenseCategories = Object.entries(expensesByCategory)
      .filter(([_, amount]) => amount / income > 0.15)
      .map(([category, amount]) => ({ category, amount, percentage: (amount / income) * 100 }))

    return {
      totalIncome: income,
      totalExpenses,
      savings,
      savingsRate: Math.round(savingsRate * 100) / 100,
      expensesByCategory,
      highExpenseCategories,
      recommendations: generateBudgetRecommendations(savingsRate, highExpenseCategories),
    }
  },
})

// Agente de Simulação de Investimentos
export const investmentSimulatorAgent = tool({
  description: "Simula cenários de investimento com diferentes estratégias",
  parameters: z.object({
    initialAmount: z.number().describe("Valor inicial para investir"),
    monthlyContribution: z.number().describe("Aporte mensal"),
    timeHorizon: z.number().describe("Prazo em anos"),
    riskProfile: z.enum(["conservador", "moderado", "arrojado"]).describe("Perfil de risco"),
  }),
  execute: async ({ initialAmount, monthlyContribution, timeHorizon, riskProfile }) => {
    const riskProfiles = {
      conservador: { expectedReturn: 0.08, volatility: 0.02 },
      moderado: { expectedReturn: 0.12, volatility: 0.08 },
      arrojado: { expectedReturn: 0.15, volatility: 0.15 },
    }

    const profile = riskProfiles[riskProfile]
    const months = timeHorizon * 12

    // Simulação com juros compostos
    let totalAmount = initialAmount
    const monthlyReturn = profile.expectedReturn / 12

    for (let i = 0; i < months; i++) {
      totalAmount = totalAmount * (1 + monthlyReturn) + monthlyContribution
    }

    const totalInvested = initialAmount + monthlyContribution * months
    const totalReturn = totalAmount - totalInvested
    const returnPercentage = (totalReturn / totalInvested) * 100

    return {
      riskProfile,
      timeHorizon,
      totalInvested,
      projectedValue: Math.round(totalAmount),
      totalReturn: Math.round(totalReturn),
      returnPercentage: Math.round(returnPercentage * 100) / 100,
      monthlyReturn: Math.round(monthlyReturn * 10000) / 100,
      recommendations: generateInvestmentRecommendations(riskProfile, timeHorizon),
    }
  },
})

// Agente de Gestão de Dívidas
export const debtManagerAgent = tool({
  description: "Analisa dívidas e cria estratégia de quitação otimizada",
  parameters: z.object({
    debts: z
      .array(
        z.object({
          name: z.string().describe("Nome da dívida"),
          balance: z.number().describe("Saldo devedor"),
          interestRate: z.number().describe("Taxa de juros mensal"),
          minimumPayment: z.number().describe("Pagamento mínimo"),
        }),
      )
      .describe("Lista de dívidas"),
    availableAmount: z.number().describe("Valor disponível para pagamento de dívidas"),
  }),
  execute: async ({ debts, availableAmount }) => {
    // Estratégia Avalanche (maior taxa de juros primeiro)
    const avalancheStrategy = [...debts].sort((a, b) => b.interestRate - a.interestRate)

    // Estratégia Snowball (menor saldo primeiro)
    const snowballStrategy = [...debts].sort((a, b) => a.balance - b.balance)

    // Calcula tempo para quitar com cada estratégia
    const avalancheTime = calculatePayoffTime(avalancheStrategy, availableAmount)
    const snowballTime = calculatePayoffTime(snowballStrategy, availableAmount)

    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
    const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)
    const extraPayment = availableAmount - totalMinimumPayment

    return {
      totalDebt,
      totalMinimumPayment,
      availableAmount,
      extraPayment,
      avalancheStrategy: {
        order: avalancheStrategy.map((d) => d.name),
        estimatedMonths: avalancheTime,
      },
      snowballStrategy: {
        order: snowballStrategy.map((d) => d.name),
        estimatedMonths: snowballTime,
      },
      recommendations: generateDebtRecommendations(debts, extraPayment),
    }
  },
})

// Agente de Planejamento Financeiro
export const financialPlannerAgent = tool({
  description: "Cria plano financeiro personalizado baseado em objetivos",
  parameters: z.object({
    age: z.number().describe("Idade atual"),
    income: z.number().describe("Renda mensal"),
    currentSavings: z.number().describe("Valor atual poupado"),
    goals: z
      .array(
        z.object({
          name: z.string().describe("Nome do objetivo"),
          targetAmount: z.number().describe("Valor necessário"),
          timeframe: z.number().describe("Prazo em anos"),
          priority: z.enum(["alta", "média", "baixa"]).describe("Prioridade"),
        }),
      )
      .describe("Objetivos financeiros"),
  }),
  execute: async ({ age, income, currentSavings, goals }) => {
    const retirementAge = 65
    const yearsToRetirement = retirementAge - age

    // Calcula necessidade para aposentadoria (25x gastos anuais)
    const estimatedAnnualExpenses = income * 12 * 0.8 // 80% da renda atual
    const retirementNeeded = estimatedAnnualExpenses * 25

    // Ordena objetivos por prioridade e prazo
    const prioritizedGoals = goals.sort((a, b) => {
      const priorityOrder = { alta: 3, média: 2, baixa: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority] || a.timeframe - b.timeframe
    })

    // Calcula valor mensal necessário para cada objetivo
    const goalsWithMonthlyAmount = prioritizedGoals.map((goal) => {
      const months = goal.timeframe * 12
      const monthlyAmount = goal.targetAmount / months
      return { ...goal, monthlyAmount }
    })

    const totalMonthlyForGoals = goalsWithMonthlyAmount.reduce((sum, goal) => sum + goal.monthlyAmount, 0)

    return {
      currentAge: age,
      retirementAge,
      yearsToRetirement,
      retirementNeeded,
      currentSavings,
      prioritizedGoals: goalsWithMonthlyAmount,
      totalMonthlyForGoals,
      recommendations: generateFinancialPlanRecommendations(income, totalMonthlyForGoals, yearsToRetirement),
    }
  },
})

// Funções auxiliares
function generateBudgetRecommendations(savingsRate: number, highExpenseCategories: any[]) {
  const recommendations = []

  if (savingsRate < 10) {
    recommendations.push("Sua taxa de poupança está baixa. Tente economizar pelo menos 10% da renda.")
  }

  highExpenseCategories.forEach((category) => {
    recommendations.push(
      `Categoria "${category.category}" representa ${category.percentage.toFixed(1)}% da renda. Considere reduzir estes gastos.`,
    )
  })

  return recommendations
}

function generateInvestmentRecommendations(riskProfile: string, timeHorizon: number) {
  const recommendations = []

  if (timeHorizon < 2) {
    recommendations.push("Para prazos curtos, prefira investimentos de baixo risco como CDB e Tesouro Selic.")
  } else if (timeHorizon > 10) {
    recommendations.push("Para prazos longos, considere aumentar a exposição a ações e fundos de ações.")
  }

  if (riskProfile === "conservador") {
    recommendations.push("Considere diversificar com Tesouro IPCA+ e CDBs de bancos médios para melhor rentabilidade.")
  }

  return recommendations
}

function generateDebtRecommendations(debts: any[], extraPayment: number) {
  const recommendations = []

  if (extraPayment <= 0) {
    recommendations.push("Tente aumentar a renda ou reduzir gastos para acelerar a quitação das dívidas.")
  }

  const highInterestDebts = debts.filter((debt) => debt.interestRate > 0.03)
  if (highInterestDebts.length > 0) {
    recommendations.push("Priorize quitar dívidas com juros acima de 3% ao mês.")
  }

  return recommendations
}

function generateFinancialPlanRecommendations(income: number, totalMonthlyForGoals: number, yearsToRetirement: number) {
  const recommendations = []

  if (totalMonthlyForGoals > income * 0.3) {
    recommendations.push("Seus objetivos podem estar muito ambiciosos. Considere revisar prazos ou valores.")
  }

  if (yearsToRetirement < 10) {
    recommendations.push("Foque em investimentos mais conservadores para preservar o capital próximo à aposentadoria.")
  }

  return recommendations
}

function calculatePayoffTime(debts: any[], availableAmount: number): number {
  // Simulação simplificada - retorna estimativa em meses
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length

  if (availableAmount <= 0) return Number.POSITIVE_INFINITY

  // Fórmula aproximada considerando juros compostos
  const months = Math.log(1 + (totalDebt * avgInterestRate) / availableAmount) / Math.log(1 + avgInterestRate)
  return Math.ceil(months)
}
