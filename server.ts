import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import middie from '@fastify/middie';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { metricsRoutes } from './src/modules/metrics/routes';
import { configRoutes } from './src/modules/config/routes';
import { partnersRoutes } from './src/modules/partners/routes';
import { financeRoutes } from './src/modules/finance/routes';

const server = fastify({ logger: true });

async function start() {
  await server.register(cors);
  await server.register(middie);

  // API Routes
  server.register(metricsRoutes, { prefix: '/api/metrics' });
  server.register(configRoutes, { prefix: '/api/config' });
  server.register(partnersRoutes, { prefix: '/api/partners' });
  server.register(financeRoutes, { prefix: '/api/finance' });

  await server.after();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    server.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    server.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
    });
    
    server.setNotFoundHandler((request, reply) => {
      reply.sendFile('index.html');
    });
  }

  const PORT = 3000;
  server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

start();
