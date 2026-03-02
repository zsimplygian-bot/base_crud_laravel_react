"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import * as Recharts from "recharts"

const chartConfig = {
  total: {
    label: "Registros",
    color: "hsl(217 91% 60%)", // Azul sobrio
  },
}

export default function DashboardCharts({ menus }) {
  const data = menus.map(item => ({
    name: item.label,
    total: item.total,
  }))

  return (
    <Card className="rounded-xl border shadow-sm p-4">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold">
          Registros por módulo
        </CardTitle>
      </CardHeader>

      <ChartContainer config={chartConfig} className="h-[260px]">
        <Recharts.BarChart data={data}>
          <Recharts.XAxis dataKey="name" />
          <Recharts.YAxis />
          <Recharts.Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[6, 6, 0, 0]}
          />
        </Recharts.BarChart>
      </ChartContainer>
    </Card>
  )
}