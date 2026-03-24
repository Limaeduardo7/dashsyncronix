import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

export async function metricsRoutes(server: FastifyInstance) {
  server.get('/', async () => {
    const metrics = await prisma.metricsDaily.findMany({
      orderBy: { date: 'desc' },
    });
    return metrics;
  });

  server.post('/', async (request) => {
    const schema = z.object({
      date: z.string(),
      faturamentoHotmart: z.number(),
      faturamentoYoutube: z.number(),
      investimentoMeta: z.number(),
      investimentoGoogle: z.number(),
    });

    const data = schema.parse(request.body);
    const date = new Date(data.date);
    date.setUTCHours(0, 0, 0, 0);

    const metrics = await prisma.metricsDaily.upsert({
      where: { date },
      update: {
        faturamentoHotmart: data.faturamentoHotmart,
        faturamentoYoutube: data.faturamentoYoutube,
        investimentoMeta: data.investimentoMeta,
        investimentoGoogle: data.investimentoGoogle,
      },
      create: {
        date,
        faturamentoHotmart: data.faturamentoHotmart,
        faturamentoYoutube: data.faturamentoYoutube,
        investimentoMeta: data.investimentoMeta,
        investimentoGoogle: data.investimentoGoogle,
      },
    });

    return metrics;
  });
}
