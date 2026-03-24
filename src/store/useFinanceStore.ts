import { create } from 'zustand';

interface FinanceState {
  metrics: any[];
  config: any;
  partners: any[];
  summary: any;
  loading: boolean;
  fetchMetrics: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  fetchPartners: () => Promise<void>;
  fetchSummary: (start?: string, end?: string) => Promise<void>;
  saveMetrics: (data: any) => Promise<void>;
  saveConfig: (data: any) => Promise<void>;
  savePartners: (data: any) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  metrics: [],
  config: null,
  partners: [],
  summary: null,
  loading: false,

  fetchMetrics: async () => {
    const res = await fetch('/api/metrics');
    set({ metrics: await res.json() });
  },

  fetchConfig: async () => {
    const res = await fetch('/api/config');
    set({ config: await res.json() });
  },

  fetchPartners: async () => {
    const res = await fetch('/api/partners');
    set({ partners: await res.json() });
  },

  fetchSummary: async (start, end) => {
    set({ loading: true });
    let url = '/api/finance/summary';
    if (start && end) {
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      if (end) params.append('end', end);
      url += `?${params.toString()}`;
    }
    const res = await fetch(url);
    set({ summary: await res.json(), loading: false });
  },

  saveMetrics: async (data) => {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await get().fetchMetrics();
    await get().fetchSummary();
  },

  saveConfig: async (data) => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await get().fetchConfig();
    await get().fetchSummary();
  },

  savePartners: async (data) => {
    await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await get().fetchPartners();
    await get().fetchSummary();
  },
}));
