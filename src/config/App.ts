/* eslint-disable no-console */
import cors from '@fastify/cors';
import fastify, { type FastifyInstance } from 'fastify';

import type { Router } from '@/interfaces';

import { envs } from './Envs';

export class App {
  private readonly app: FastifyInstance;
  private readonly host: string;
  private readonly port: number;

  constructor(host: string, port: number) {
    this.app = fastify({ logger: envs.loggerEnabled });
    this.app.register(cors, { origin: true });
    this.host = host;
    this.port = port;
  }

  registerRoutes(routes: Array<any>) {
    routes.forEach((Router) => {
      const r = new Router() as Router;
      this.app.register(r.routes, { prefix: r.endpointUri });
    });
  }

  listen() {
    this.app.listen({ host: this.host, port: this.port }, (err, address) => {
      if (err) {
        this.app.log.error(err);
        throw err;
      }

      this.app.log.info('Bootstrap completed successfully');
      console.log(`\n> Listening at ${address}\n`);
    });
  }
}
