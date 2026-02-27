const http = require('http');
const url = require('url');

class MiniExpress {
  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      PATCH: {},
      DELETE: {}
    };
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  get(path, handler) {
    this.routes.GET[path] = handler;
  }

  post(path, handler) {
    this.routes.POST[path] = handler;
  }

  put(path, handler) {
    this.routes.PUT[path] = handler;
  }

  patch(path, handler) {
    this.routes.PATCH[path] = handler;
  }

  delete(path, handler) {
    this.routes.DELETE[path] = handler;
  }

  createServer() {
    return http.createServer(async (req, res) => {
      try {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;
        const method = req.method;
        
        req.query = parsedUrl.query;
        req.params = {};
        
        res.send = (data) => {
          res.setHeader('Content-Type', 'text/plain');
          res.end(data);
        };
        
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };
        
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };

        for (const middleware of this.middlewares) {
          await new Promise((resolve) => {
            middleware(req, res, resolve);
          });
        }

        const routeKey = Object.keys(this.routes[method]).find(routePath => {
          const routeParts = routePath.split('/');
          const pathParts = path.split('/');
          
          if (routeParts.length !== pathParts.length) return false;
          
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              const paramName = routeParts[i].substring(1);
              req.params[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              return false;
            }
          }
          return true;
        });

        if (routeKey && this.routes[method][routeKey]) {
          await this.routes[method][routeKey](req, res);
        } else {
          res.status(404).json({ error: 'Маршрут не найден' });
        }
      } catch (error) {
        console.error('Ошибка сервера:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
      }
    });
  }

  listen(port, callback) {
    const server = this.createServer();
    server.listen(port, callback);
  }
}

module.exports = MiniExpress;