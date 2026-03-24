import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

export async function partnersRoutes(server: FastifyInstance) {
  server.get('/', async () => {
    const partners = await prisma.partner.findMany();
    if (partners.length === 0) {
      const defaults = [
        { nome: 'Bruno', percentual: 35 },
        { nome: 'Lennon', percentual: 25 },
        { nome: 'Eduardo', percentual: 15 },
        { nome: 'Gustavo', percentual: 15 },
        { nome: 'Kyrlian', percentual: 10 },
      ];
      for (const p of defaults) {
        await prisma.partner.create({ data: p });
      }
      return await prisma.partner.findMany();
    }
    return partners;
  });

  server.post('/', async (request) => {
    const schema = z.array(z.object({
      nome: z.string(),
      percentual: z.number(),
    }));
    const data = schema.parse(request.body);
    
    for (const p of data) {
      await prisma.partner.upsert({
        where: { nome: p.nome },
        update: { percentual: p.percentual },
        create: { nome: p.nome, percentual: p.percentual },
      });
    }
    return await prisma.partner.findMany();
  });
}
