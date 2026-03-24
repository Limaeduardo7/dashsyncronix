import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { calcularFinanceiro } from './logic';
import { differenceInDays, startOfMonth, endOfMonth } from 'date-fns';

export async function financeRoutes(server: FastifyInstance) {
  server.get('/summary', async (request: any) => {
    const { start, end } = request.query;
    const startDate = start ? new Date(start) : startOfMonth(new Date());
    const endDate = end ? new Date(end) : endOfMonth(new Date());

    const metrics = await prisma.metricsDaily.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const config = await prisma.config.findUnique({ where: { id: 1 } }) || {
      custoFixoMensal: 12500,
      impostoMetaPercent: 15,
      impostoFaturamentoPercent: 6,
      percentualReserva: 10,
    };

    const aggregated = metrics.reduce((acc, m) => ({
      faturamentoHotmart: acc.faturamentoHotmart + m.faturamentoHotmart,
      faturamentoYoutube: acc.faturamentoYoutube + m.faturamentoYoutube,
      investimentoMeta: acc.investimentoMeta + m.investimentoMeta,
      investimentoGoogle: acc.investimentoGoogle + m.investimentoGoogle,
    }), {
      faturamentoHotmart: 0,
      faturamentoYoutube: 0,
      investimentoMeta: 0,
      investimentoGoogle: 0,
    });

    const diasNoPeriodo = differenceInDays(endDate, startDate) + 1;
    
    const result = calcularFinanceiro(
      aggregated.faturamentoHotmart,
      aggregated.faturamentoYoutube,
      aggregated.investimentoMeta,
      aggregated.investimentoGoogle,
      config.custoFixoMensal,
      config.impostoMetaPercent,
      config.impostoFaturamentoPercent,
      config.percentualReserva,
      diasNoPeriodo
    );

    const partners = await prisma.partner.findMany();
    const division = partners.map(p => ({
      nome: p.nome,
      valor: result.lucroFinal * (p.percentual / 100),
      percentual: p.percentual
    }));

    const alerts = [];
    if (result.roas < 2) alerts.push({ type: 'warning', message: 'ROAS baixo detectado (< 2.0)' });
    if (result.lucroFinal < 0) alerts.push({ type: 'danger', message: 'Prejuízo detectado no período' });
    if (result.investimentoTotal > result.faturamentoTotal * 0.5) alerts.push({ type: 'warning', message: 'Custo de investimento muito alto (> 50% do faturamento)' });

    return {
      summary: result,
      division,
      alerts,
      period: { start: startDate, end: endDate }
    };
  });
}
