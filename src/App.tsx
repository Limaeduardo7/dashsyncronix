import { useEffect, useState } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import { MetricCard } from './components/MetricCard';
import { DailyRevenueChart, WaterfallChart, PartnerPieChart, ROASGauge, CumulativeChart } from './components/DashboardCharts';
import { InputPanel } from './components/InputPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { DateRangePicker } from './components/DateRangePicker';
import { formatCurrency } from './utils/format';
import { LayoutDashboard, PlusCircle, Settings, Menu, X, DollarSign, TrendingUp, Wallet, Target } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { summary, metrics, fetchAll, setDateRange, dateRange, loading } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDateChange = (start: string, end: string) => {
    setDateRange(start, end);
  };

  // Sparkline data from metrics
  const hotmartSparkline = metrics.map((m: any) => m.faturamentoHotmart || 0);
  const investSparkline = metrics.map((m: any) => (m.investimentoMeta || 0) + (m.investimentoGoogle || 0));
  const profitSparkline = metrics.map((m: any) => (m.faturamentoHotmart || 0) - (m.investimentoMeta || 0) - (m.investimentoGoogle || 0));

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="font-bold tracking-widest uppercase text-xs animate-pulse">Sincronizando...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'input', label: 'Lançamentos', icon: PlusCircle },
    { key: 'config', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-surface-container-low via-surface-container-low to-surface',
        'border-r border-outline-variant/10',
        sidebarOpen ? 'w-60' : 'w-[68px]',
        'lg:relative',
        !sidebarOpen && 'max-lg:-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo area */}
        <div className={cn(
          'flex items-center h-16 border-b border-outline-variant/10 shrink-0',
          sidebarOpen ? 'px-5 gap-3' : 'px-0 justify-center'
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-primary/60 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">SX</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-on-surface text-sm tracking-wide">SYNCRONIX</h1>
              <p className="text-[9px] uppercase tracking-[0.15em] text-primary/70 font-semibold">Financeiro</p>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-on-surface-variant hover:text-on-surface transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 py-4 px-3">
          <span className={cn(
            'text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/50 mb-2',
            sidebarOpen ? 'px-3' : 'text-center'
          )}>
            {sidebarOpen ? 'Menu' : '•••'}
          </span>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              title={label}
              className={cn(
                'flex items-center gap-3 rounded-xl transition-all duration-200 group relative',
                sidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center',
                activeTab === key
                  ? 'bg-primary/15 text-primary shadow-sm shadow-primary/5'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              )}
            >
              {activeTab === key && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}
              <Icon className={cn('w-[18px] h-[18px] shrink-0', !sidebarOpen && 'mx-auto')} />
              {sidebarOpen && <span className="font-medium text-[13px] whitespace-nowrap">{label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-surface-container-highest text-on-surface text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg z-50">
                  {label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className={cn(
          'border-t border-outline-variant/10 py-3 shrink-0',
          sidebarOpen ? 'px-5' : 'px-0 flex justify-center'
        )}>
          {sidebarOpen ? (
            <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-wider">v1.0 · Hexacron</p>
          ) : (
            <div className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse" title="Online" />
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-lg hover:bg-surface-container-high">
                <Menu className="w-5 h-5" />
              </button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-lg hover:bg-surface-container-high">
                <Menu className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg font-bold tracking-tight capitalize leading-tight">{activeTab}</h2>
                {activeTab === 'dashboard' && summary?.period && (
                  <p className="text-[10px] text-on-surface-variant">
                    {new Date(summary.period.start).toLocaleDateString('pt-BR')} — {new Date(summary.period.end).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            {activeTab === 'dashboard' && (
              <DateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={handleDateChange}
              />
            )}
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && summary && (
            <>
              {/* Alerts */}
              {summary.alerts?.length > 0 && (
                <div className="space-y-2">
                  {summary.alerts.map((alert: any, i: number) => (
                    <div key={i} className={cn(
                      'px-4 py-3 rounded-lg flex items-center gap-3 border text-sm font-medium',
                      alert.type === 'danger' ? 'bg-tertiary/10 border-tertiary/30 text-tertiary' : 'bg-accent-amber/10 border-accent-amber/30 text-accent-amber'
                    )}>
                      {alert.message}
                    </div>
                  ))}
                </div>
              )}

              {/* Row 1: Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Faturamento Total"
                  value={summary.summary.faturamentoTotal}
                  color="primary"
                  large
                  sparklineData={hotmartSparkline}
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <MetricCard
                  label="Investimento Total"
                  value={summary.summary.investimentoTotal}
                  color="tertiary"
                  large
                  sparklineData={investSparkline}
                  icon={<Target className="w-5 h-5" />}
                />
                <MetricCard
                  label="Lucro Final"
                  value={summary.summary.lucroFinal}
                  color="secondary"
                  large
                  sparklineData={profitSparkline}
                  icon={<Wallet className="w-5 h-5" />}
                />
                <MetricCard
                  label="ROAS"
                  value={summary.summary.roas}
                  isCurrency={false}
                  color={summary.summary.roas > 2 ? 'secondary' : summary.summary.roas > 1 ? 'alert' : 'tertiary'}
                  large
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </div>

              {/* Row 2: Daily Revenue */}
              {metrics.length > 0 && (
                <DailyRevenueChart metrics={metrics} />
              )}

              {/* Row 3: Waterfall + Pie + ROAS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <WaterfallChart summary={summary.summary} />
                <PartnerPieChart division={summary.division} />
                <ROASGauge roas={summary.summary.roas} />
              </div>

              {/* Row 4: Cumulative */}
              {metrics.length > 0 && (
                <CumulativeChart metrics={metrics} />
              )}

              {/* Row 5: Secondary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <MetricCard label="Hotmart" value={summary.summary.faturamentoHotmart} color="primary" />
                <MetricCard label="Lucro Bruto" value={summary.summary.lucroBruto} color="secondary" />
                <MetricCard label="Impostos" value={summary.summary.impostoFaturamento} color="tertiary" />
                <MetricCard label="Custos Fixos" value={summary.summary.custoFixoProporcional} color="alert" />
                <MetricCard label="Reserva" value={summary.summary.reserva} color="primary" />
              </div>

              {/* Row 6: Partner Division Cards */}
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Divisão entre Sócios</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {summary.division.map((p: any) => (
                    <div key={p.nome} className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <p className="text-[10px] uppercase text-on-surface-variant font-bold mb-1">{p.nome} ({p.percentual}%)</p>
                      <p className="text-lg font-bold tabular-nums text-on-surface">{formatCurrency(p.valor)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'input' && <InputPanel />}
          {activeTab === 'config' && <ConfigPanel />}
        </div>
      </main>
    </div>
  );
}
