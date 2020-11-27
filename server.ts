import 'zone.js/dist/zone-node';
import * as dotenv from 'dotenv';
try {
  dotenv.config();
} catch (error) {
  console.log('Invalid configuration');
}
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as session from 'express-session';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { AuthService } from 'server/auth.service';
import { json, urlencoded } from 'body-parser';

function setSession(server: express.Express): void {
  if (!process.env.COOKIE_SECRET) {
    throw Error('Invalid session configuration');
  }
  const sess: session.SessionOptions = {
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };

  if (server.get('env') === 'production') {
    server.set('trust proxy', 1); // trust first proxy
    // tslint:disable-next-line: no-non-null-assertion
    sess.cookie!.secure = true; // serve secure cookies
  }

  server.use(session(sess));
}
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.use(json());
  server.use(
    urlencoded({
      extended: true,
    })
  );

  setSession(server);

  server.use((req: any, res, next) => {
    if (req.method === 'POST') {
      try {
        const a = new AuthService(
          process.env.CANVAS_CONSUMER_SECRET
        ).checkAuthenticated(req.body);
        req.auth = a;
        return next();
      } catch (error) {
        return res.status(401).send({ error });
      }
    }
    next();
  });
  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });
  // All post requests will also render a view and use Universal engine
  server.post('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });
  return server;
}

function run(): void {
  const port = process.env.PORT || 3000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
