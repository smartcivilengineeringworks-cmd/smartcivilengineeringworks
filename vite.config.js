import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        // Helper response methods
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        req.query = Object.fromEntries(urlObj.searchParams);

        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          let body = '';
          for await (const chunk of req) {
            body += chunk;
          }
          if (body) {
            try {
              req.body = JSON.parse(body);
            } catch {
              req.body = {};
            }
          }
        }

        try {
          if (urlObj.pathname.startsWith('/api/projects')) {
            const { default: handler } = await server.ssrLoadModule('/api/projects.js');
            return await handler(req, res);
          } else if (urlObj.pathname.startsWith('/api/auth')) {
            const { default: handler } = await server.ssrLoadModule('/api/auth.js');
            return await handler(req, res);
          } else if (urlObj.pathname.startsWith('/api/inquiries')) {
            const { default: handler } = await server.ssrLoadModule('/api/inquiries.js');
            return await handler(req, res);
          }
          next();
        } catch (err) {
          console.error('API middleware error:', err);
          res.status(500).json({ error: err.message });
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevMiddleware()]
});
