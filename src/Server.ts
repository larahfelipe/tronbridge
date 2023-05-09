import { App, envs } from '@/config';
import { AccountRouter, TransactionRouter } from '@/routes';

const bootstrap = async () => {
  try {
    const app = new App(envs.host, +envs.port);

    app.registerRoutes([AccountRouter, TransactionRouter]);

    app.listen();
  } catch (e) {
    console.error(e);
  }
};

bootstrap();
