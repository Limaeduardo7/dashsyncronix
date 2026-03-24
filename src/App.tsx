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
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full bg-surface-container-low flex flex-col py-6 z-50 border-r border-outline-variant/10 transition-all duration-300',
        sidebarOpen ? 'w-56 px-4' : 'w-16 px-2',
        'lg:relative',
        !sidebarOpen && 'max-lg:-translate-x-full lg:translate-x-0'
      )}>
        <div className="mb-8 flex items-center justify-between px-1">
          <div className={cn('overflow-hidden transition-all', sidebarOpen ? 'w-auto' : 'w-0 lg:w-auto')}>
            <h1 className={cn('font-bold text-on-surface whitespace-nowrap', sidebarOpen ? 'text-lg' : 'text-[10px] text-center')}>
              {sidebarOpen ? 'SYNCRONIX' : 'SX'}
            </h1>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              title={label}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                activeTab === key
                  ? 'bg-primary-container/20 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={cn('font-medium text-sm whitespace-nowrap', !sidebarOpen && 'hidden')}>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-on-surface-variant hover:text-on-surface">
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold tracking-tight capitalize">{activeTab}</h2>
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
