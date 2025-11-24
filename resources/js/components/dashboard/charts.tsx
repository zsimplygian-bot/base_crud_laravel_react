"use client";

import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { FieldCombobox } from "@/components/form/field-combobox";
import { FieldDate } from "@/components/form/field-datepicker";

export default function DashboardCharts() {
  const [selectedTable, setSelectedTable] = useState<string>("cita");
  const [range, setRange] = useState<{ from?: string; to?: string }>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    serie?: Array<{ dia: string; total: number }>;
    distribucion?: Array<{ label: string; total: number }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tableField = {
    key: "dashboard_table",
    placeholder: "Seleccionar tabla",
  };

  // Fetch automático cada vez que cambia selectedTable o rango
  const fetchCharts = async () => {
    if (!range.from || !range.to) {
      setError("Selecciona un rango de fechas.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const query = new URLSearchParams({
        table: selectedTable,
        from: range.from,
        to: range.to,
      });

      const res = await fetch(`/api/dashboard/charts?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setStats({
        serie: json.serie ?? [],
        distribucion: json.distribucion ?? [],
      });
    } catch (e: any) {
      setError(e?.message ?? "Error al obtener datos");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Inicializar rango de fechas y hacer fetch inicial
  useEffect(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);

    setRange({ from: first, to: last });
  }, []);

  // Ejecutar fetch automáticamente cuando cambian los parámetros
  useEffect(() => {
    if (range.from && range.to) {
      fetchCharts();
    }
  }, [selectedTable, range.from, range.to]);

  return (
    <div className="mt-8 space-y-6">
      {/* FILTROS */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <FieldCombobox
            id="dashboard_table"
            field={tableField}
            value={selectedTable}
            disabled={false}
            setData={(_, v) => setSelectedTable(v)}
          />
        </div>

        <div className="w-40">
          <FieldDate
            id="field-from"
            value={range.from}
            disabled={false}
            setData={(_, v) => setRange((prev) => ({ ...prev, from: v }))}
          />
        </div>

        <div className="w-40">
          <FieldDate
            id="field-to"
            value={range.to}
            disabled={false}
            setData={(_, v) => setRange((prev) => ({ ...prev, to: v }))}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 ml-2">
            {error}
          </div>
        )}
      </div>

      {/* GRAFICOS */}
      <div className="grid grid-cols-1 gap-6">
        {/* BARRAS */}
        <div className="rounded-xl border p-4 shadow-lg">
          <h3 className="text-lg font-semibold mb-3">
            Registros — {selectedTable}
          </h3>

          <ChartContainer
            config={{ total: { label: "Total", color: "#8884d8" } }}
            className="w-full h-[300px]"
          >
            <BarChart data={stats?.serie ?? []}>
              <XAxis dataKey="dia" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
