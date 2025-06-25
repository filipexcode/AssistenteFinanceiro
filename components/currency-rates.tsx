"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CurrencyRate {
  code: string
  name: string
  rate: number
  change?: number
  flag: string
}

export function CurrencyRates() {
  const [rates, setRates] = useState<CurrencyRate[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchRates = async () => {
    try {
      setLoading(true)
      // Usando API gratuita para cotações em relação ao Real (BRL)
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL")
      const data = await response.json()

      const currencyData: CurrencyRate[] = [
        {
          code: "USD",
          name: "Dólar Americano",
          rate: 1 / data.rates.USD, // Invertendo para mostrar quantos reais vale 1 USD
          flag: "🇺🇸",
        },
        {
          code: "EUR",
          name: "Euro",
          rate: 1 / data.rates.EUR, // Invertendo para mostrar quantos reais vale 1 EUR
          flag: "🇪🇺",
        },
        {
          code: "GBP",
          name: "Libra Esterlina",
          rate: 1 / data.rates.GBP, // Invertendo para mostrar quantos reais vale 1 GBP
          flag: "🇬🇧",
        },
      ]

      setRates(currencyData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Erro ao buscar cotações:", error)
      // Dados de fallback em caso de erro
      setRates([
        { code: "USD", name: "Dólar Americano", rate: 5.2, flag: "🇺🇸" },
        { code: "EUR", name: "Euro", rate: 5.65, flag: "🇪🇺" },
        { code: "GBP", name: "Libra Esterlina", rate: 6.45, flag: "🇬🇧" },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchRates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">💱 Cotações Principais</CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchRates} disabled={loading} className="h-8 w-8 p-0">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {lastUpdate && <p className="text-xs text-gray-500">Última atualização: {formatTime(lastUpdate)}</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && rates.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          rates.map((currency) => (
            <div
              key={currency.code}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currency.flag}</span>
                <div>
                  <div className="font-semibold text-sm">{currency.code}</div>
                  <div className="text-xs text-gray-600">{currency.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-700">{formatCurrency(currency.rate)}</div>
                {currency.change && (
                  <Badge variant={currency.change > 0 ? "default" : "destructive"} className="text-xs">
                    {currency.change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(currency.change).toFixed(2)}%
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
        <div className="text-xs text-gray-500 text-center pt-2 border-t">💡 Cotações em tempo real para referência</div>
      </CardContent>
    </Card>
  )
}
