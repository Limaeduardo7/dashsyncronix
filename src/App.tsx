/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { MetricCard } from './components/MetricCard';
import { DashboardCharts } from './components/DashboardCharts';
import { InputPanel } from './components/InputPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { formatCurrency } from './utils/format';
import { AlertCircle, Settings, PlusCircle, LayoutDashboard } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { summary, fetchSummary, loading } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <span className="font-bold tracking-widest uppercase text-xs">Sincronizando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low flex flex-col py-6 px-4 gap-2 z-50 border-r border-outline-variant/5">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-bold text-on-surface mb-1">SYNCRONIX</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-70">Dashboard Financeiro</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-r-md transition-all duration-200",
              activeTab === 'dashboard' ? "bg-surface-container-high text-primary border-l-4 border-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-r-md transition-all duration-200",
              activeTab === 'input' ? "bg-surface-container-high text-primary border-l-4 border-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Lançamentos</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-r-md transition-all duration-200",
              activeTab === 'config' ? "bg-surface-container-high text-primary border-l-4 border-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 space-y-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant bg-surface-container-high px-4 py-2 rounded-lg">
              {summary?.period?.start && new Date(summary.period.start).toLocaleDateString('pt-BR')} - {summary?.period?.end && new Date(summary.period.end).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </header>

        {activeTab === 'dashboard' && summary && (
          <div className="space-y-8">
            {/* Alerts */}
            {summary.alerts.length > 0 && (
              <div className="space-y-2">
                {summary.alerts.map((alert: any, i: number) => (
                  <div key={i} className={cn(
                    "p-4 rounded-lg flex items-center gap-3 border",
                    alert.type === 'danger' ? "bg-tertiary/10 border-tertiary text-tertiary" : "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                  )}>
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Faturamento Hotmart" value={summary.summary.faturamentoHotmart} tooltip="Receita bruta da plataforma Hotmart" />
              <MetricCard label="Faturamento YouTube" value={summary.summary.faturamentoYoutube} tooltip="Receita bruta do AdSense e patrocínios" />
              <MetricCard label="Faturamento Total" value={summary.summary.faturamentoTotal} color="secondary" tooltip="Soma de todas as fontes de receita" />
              <MetricCard label="Meta Ads (com imposto)" value={summary.summary.investimentoTotal - summary.summary.investimentoGoogle} color="tertiary" tooltip="Investimento em Meta Ads incluindo impostos" />
              <MetricCard label="Google Ads" value={summary.summary.investimentoGoogle} color="tertiary" tooltip="Investimento bruto em Google Ads" />
              <MetricCard label="Investimento Total" value={summary.summary.investimentoTotal} color="tertiary" tooltip="Soma de todos os investimentos em tráfego" />
              <MetricCard label="Lucro Bruto" value={summary.summary.lucroBruto} color="secondary" tooltip="Faturamento Total - Investimento Total" />
              <MetricCard label="Imposto Faturamento" value={summary.summary.impostoFaturamento} color="tertiary" tooltip="Imposto calculado sobre o faturamento bruto" />
              <MetricCard label="Lucro Líquido" value={summary.summary.lucroLiquido} color="secondary" tooltip="Lucro Bruto - Imposto Faturamento" />
              <MetricCard label="Custos Fixos" value={summary.summary.custoFixoProporcional} color="tertiary" tooltip="Custos fixos proporcionais ao período" />
              <MetricCard label="Lucro Líquido Limpo" value={summary.summary.lucroLiquidoLimpo} color="secondary" tooltip="Lucro Líquido - Custos Fixos" />
              <MetricCard label="Reserva" value={summary.summary.reserva} color="primary" tooltip="Percentual destinado à reserva de emergência" />
              <MetricCard label="Lucro Final" value={summary.summary.lucroFinal} color="secondary" tooltip="Lucro Líquido Limpo - Reserva" />
              <MetricCard label="ROAS" value={summary.summary.roas} isCurrency={false} color={summary.summary.roas > 2 ? 'secondary' : 'alert'} tooltip="Retorno sobre investimento em anúncios" />
            </div>

            {/* Charts */}
            <DashboardCharts summary={summary.summary} division={summary.division} />

            {/* Partner Division */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Divisão entre Sócios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {summary.division.map((p: any) => (
                  <div key={p.nome} className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/5">
                    <p className="text-[10px] uppercase text-on-surface-variant font-bold mb-1">{p.nome} ({p.percentual}%)</p>
                    <p className="text-lg font-bold tabular-nums">{formatCurrency(p.valor)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'input' && <InputPanel />}
        {activeTab === 'config' && <ConfigPanel />}
      </main>
    </div>
  );
}
