import { App, envs } from '@/config';
import { AccountRouter, TokenRouter, TransactionRouter } from '@/routes';

const bootstrap = async () => {
  try {
    const app = new App(envs.host, +envs.port);

    app.registerRoutes([AccountRouter, TokenRouter, TransactionRouter]);

    app.listen();
  } catch (e) {
    console.error(e);
  }
};

bootstrap();
