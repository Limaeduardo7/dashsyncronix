export interface FinanceiroResult {
  faturamentoTotal: number;
  investimentoTotal: number;
  lucroBruto: number;
  impostoFaturamento: number;
  lucroLiquido: number;
  custoFixoProporcional: number;
  lucroLiquidoLimpo: number;
  reserva: number;
  lucroFinal: number;
  margemBruta: number;
  margemLiquida: number;
  roas: number;
}

export function calcularFinanceiro(
  faturamentoHotmart: number,
  faturamentoYoutube: number,
  investimentoMeta: number,
  investimentoGoogle: number,
  custoFixoMensal: number,
  impostoMetaPercent: number,
  impostoFaturamentoPercent: number,
  percentualReserva: number,
  diasNoPeriodo: number = 1
): FinanceiroResult {
  const faturamentoTotal = faturamentoHotmart + faturamentoYoutube;
  const investimentoMetaComImposto = investimentoMeta * (1 + impostoMetaPercent / 100);
  const investimentoTotal = investimentoMetaComImposto + investimentoGoogle;
  
  const lucroBruto = faturamentoTotal - investimentoTotal;
  const impostoFaturamento = faturamentoTotal * (impostoFaturamentoPercent / 100);
  const lucroLiquido = lucroBruto - impostoFaturamento;
  
  // Custo fixo proporcional (assumindo 30 dias no mês)
  const custoFixoProporcional = (custoFixoMensal / 30) * diasNoPeriodo;
  
  const lucroLiquidoLimpo = lucroLiquido - custoFixoProporcional;
  const reserva = lucroLiquidoLimpo > 0 ? lucroLiquidoLimpo * (percentualReserva / 100) : 0;
  const lucroFinal = lucroLiquidoLimpo - reserva;
  
  const margemBruta = faturamentoTotal > 0 ? (lucroBruto / faturamentoTotal) * 100 : 0;
  const margemLiquida = faturamentoTotal > 0 ? (lucroFinal / faturamentoTotal) * 100 : 0;
  const roas = investimentoTotal > 0 ? faturamentoTotal / investimentoTotal : 0;

  return {
    faturamentoTotal,
    investimentoTotal,
    lucroBruto,
    impostoFaturamento,
    lucroLiquido,
    custoFixoProporcional,
    lucroLiquidoLimpo,
    reserva,
    lucroFinal,
    margemBruta,
    margemLiquida,
    roas,
  };
}
