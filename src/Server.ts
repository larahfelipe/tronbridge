import { App, envs } from '@/config';
import { AccountRouter } from '@/routes';

const bootstrap = async () => {
  try {
    const app = new App(envs.host, +envs.port);

    app.registerRoutes([AccountRouter]);

    app.listen();
  } catch (e) {
    console.error(e);
  }
};

bootstrap();
