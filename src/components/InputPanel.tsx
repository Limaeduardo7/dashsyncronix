import { useState } from 'react';
import { useFinanceStore } from '@/src/store/useFinanceStore';
import { Card } from './ui/Card';
import { Save } from 'lucide-react';

export function InputPanel() {
  const { saveMetrics } = useFinanceStore();
  const [data, setData] = useState({
    date: new Date().toISOString().split('T')[0],
    faturamentoHotmart: 0,
    faturamentoYoutube: 0,
    investimentoMeta: 0,
    investimentoGoogle: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMetrics(data);
    alert('Métricas salvas com sucesso!');
  };

  return (
    <Card className="border-l-2 border-primary">
      <h3 className="text-xl font-semibold text-on-surface tracking-tight mb-6">Input Manual de Dados</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="space-y-2">
          <label className="block text-[0.6875rem] font-bold uppercase text-on-surface-variant/60 tracking-wider">Data</label>
          <input
            type="date"
            className="w-full bg-surface-container-lowest border-none text-on-surface text-sm p-3 rounded-md focus:ring-1 focus:ring-primary transition-all"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[0.6875rem] font-bold uppercase text-secondary tracking-wider">Faturamento Hotmart</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-surface-container-lowest border-none text-on-surface text-sm p-3 rounded-md focus:ring-1 focus:ring-secondary transition-all"
            value={data.faturamentoHotmart}
            onChange={(e) => setData({ ...data, faturamentoHotmart: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[0.6875rem] font-bold uppercase text-secondary tracking-wider">Faturamento YouTube</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-surface-container-lowest border-none text-on-surface text-sm p-3 rounded-md focus:ring-1 focus:ring-secondary transition-all"
            value={data.faturamentoYoutube}
            onChange={(e) => setData({ ...data, faturamentoYoutube: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[0.6875rem] font-bold uppercase text-tertiary tracking-wider">Investimento Meta</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-surface-container-lowest border-none text-on-surface text-sm p-3 rounded-md focus:ring-1 focus:ring-tertiary transition-all"
            value={data.investimentoMeta}
            onChange={(e) => setData({ ...data, investimentoMeta: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[0.6875rem] font-bold uppercase text-tertiary tracking-wider">Investimento Google</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-surface-container-lowest border-none text-on-surface text-sm p-3 rounded-md focus:ring-1 focus:ring-tertiary transition-all"
            value={data.investimentoGoogle}
            onChange={(e) => setData({ ...data, investimentoGoogle: Number(e.target.value) })}
            required
          />
        </div>
        <div className="md:col-span-5 flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-6 py-2 text-on-surface-variant hover:text-on-surface transition-colors text-xs font-bold uppercase tracking-widest"
            onClick={() => setData({
              date: new Date().toISOString().split('T')[0],
              faturamentoHotmart: 0,
              faturamentoYoutube: 0,
              investimentoMeta: 0,
              investimentoGoogle: 0,
            })}
          >
            Limpar
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-primary-container text-on-primary-container rounded-md flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Save className="w-4 h-4" />
            Salvar Dados
          </button>
        </div>
      </form>
    </Card>
  );
}
