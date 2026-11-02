import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import productsHandler from './api/products.js';
import membersHandler from './api/members.js';
import ordersHandler from './api/orders.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // injeta no process.env para as serverless functions funcionarem local
  process.env.VITE_WIX_API_KEY = env.VITE_WIX_API_KEY;
  process.env.VITE_WIX_SITE_ID = env.VITE_WIX_SITE_ID;
  process.env.VITE_STORE_DOMAIN = env.VITE_STORE_DOMAIN;

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          const createMockRes = (res) => ({
            setHeader: (name, value) => res.setHeader(name, value),
            status: (code) => {
              res.statusCode = code;
              return {
                json: (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
                end: () => res.end()
              };
            }
          });

          server.middlewares.use(async (req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';
            if (url === '/api/products') {
              await productsHandler(req, createMockRes(res));
            } else if (url === '/api/members') {
              await membersHandler(req, createMockRes(res));
            } else if (url === '/api/orders') {
              await ordersHandler(req, createMockRes(res));
            } else {
              next();
            }
          });
        }
      }
    ],
  };
});


