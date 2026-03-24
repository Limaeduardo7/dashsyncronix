import { useState, useEffect } from 'react';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Card } from './ui/Card';
import { Save, Users, Receipt } from 'lucide-react';

export function ConfigPanel() {
  const { config, partners, saveConfig, savePartners, fetchConfig, fetchPartners } = useFinanceStore();
  const [localConfig, setLocalConfig] = useState<any>(null);
  const [localPartners, setLocalPartners] = useState<any[]>([]);

  useEffect(() => {
    fetchConfig();
    fetchPartners();
  }, []);

  useEffect(() => {
    if (config) setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    if (partners) setLocalPartners(partners);
  }, [partners]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveConfig(localConfig);
    alert('Configurações salvas!');
  };

  const handleSavePartners = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePartners(localPartners);
    alert('Sócios salvos!');
  };

  if (!localConfig) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="text-primary w-5 h-5" />
            <h3 className="text-lg font-semibold tracking-tight">Parâmetros Fiscais</h3>
          </div>
          <form onSubmit={handleSaveConfig} className="space-y-5">
            <div className="group">
              <label className="block text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-2">Custo Fixo Mensal</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">R$</span>
                <input
                  type="number"
                  className="w-full bg-surface-container-high border-none rounded-lg py-3 pl-10 pr-4 text-primary font-mono focus:ring-1 focus:ring-primary/50 transition-all"
                  value={localConfig.custoFixoMensal}
                  onChange={(e) => setLocalConfig({ ...localConfig, custoFixoMensal: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-2">Imposto Meta %</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-tertiary font-mono focus:ring-1 focus:ring-tertiary/50 transition-all"
                    value={localConfig.impostoMetaPercent}
                    onChange={(e) => setLocalConfig({ ...localConfig, impostoMetaPercent: Number(e.target.value) })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">%</span>
                </div>
              </div>
              <div className="group">
                <label className="block text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-2">Imposto Fat. %</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-tertiary font-mono focus:ring-1 focus:ring-tertiary/50 transition-all"
                    value={localConfig.impostoFaturamentoPercent}
                    onChange={(e) => setLocalConfig({ ...localConfig, impostoFaturamentoPercent: Number(e.target.value) })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">%</span>
                </div>
              </div>
            </div>
            <div className="group">
              <label className="block text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-2">Reserva %</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-secondary font-mono focus:ring-1 focus:ring-secondary/50 transition-all"
                  value={localConfig.percentualReserva}
                  onChange={(e) => setLocalConfig({ ...localConfig, percentualReserva: Number(e.target.value) })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">%</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold tracking-tight shadow-lg active:scale-[0.98] transition-all"
            >
              Salvar Configurações
            </button>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-7">
        <Card className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-secondary w-5 h-5" />
              <h3 className="text-lg font-semibold tracking-tight">Divisão entre Sócios</h3>
            </div>
            <div className="bg-secondary/10 px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-secondary uppercase tracking-tighter">
                TOTAL {localPartners.reduce((acc, p) => acc + p.percentual, 0)}%
              </span>
            </div>
          </div>
          <form onSubmit={handleSavePartners} className="space-y-4 flex-1">
            {localPartners.map((partner, index) => (
              <div key={partner.nome} className="flex items-center gap-4 p-4 bg-surface-container rounded-lg border border-transparent hover:border-primary/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold">
                  {partner.nome[0]}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{partner.nome}</h4>
                </div>
                <div className="w-32 relative">
                  <input
                    type="number"
                    className="w-full bg-surface-container-highest border-none rounded py-2 px-3 text-right pr-8 font-mono text-primary text-sm focus:ring-1 focus:ring-primary/50"
                    value={partner.percentual}
                    onChange={(e) => {
                      const newPartners = [...localPartners];
                      newPartners[index].percentual = Number(e.target.value);
                      setLocalPartners(newPartners);
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant/50">%</span>
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-bold tracking-tight shadow-lg active:scale-[0.98] transition-all mt-auto"
            >
              Salvar Sócios
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
