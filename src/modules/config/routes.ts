import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

export async function configRoutes(server: FastifyInstance) {
  server.get('/', async () => {
    let config = await prisma.config.findUnique({ where: { id: 1 } });
    if (!config) {
      config = await prisma.config.create({
        data: {
          id: 1,
          custoFixoMensal: 12500,
          impostoMetaPercent: 15,
          impostoFaturamentoPercent: 6,
          percentualReserva: 10,
        },
      });
    }
    return config;
  });

  server.post('/', async (request) => {
    const schema = z.object({
      custoFixoMensal: z.number(),
      impostoMetaPercent: z.number(),
      impostoFaturamentoPercent: z.number(),
      percentualReserva: z.number(),
    });
    const data = schema.parse(request.body);
    return await prisma.config.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
  });
}
