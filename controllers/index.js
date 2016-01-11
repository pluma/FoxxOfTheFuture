const context = module.context;
const sessionsMiddleware = require('@arangodb/foxx/sessions'); // replaces activateSessions
const headerTransport = require('@arangodb/foxx/sessions/transports/header');
const cookieTransport = require('@arangodb/foxx/sessions/transports/cookie');
const jwtStorage = require('@arangodb/foxx/sessions/storages/jwt'); // not a Foxx app
const helloWorldRouter = require('./hello-world');
const todosRouter = require('./todos');

// Middleware can be used on the context directly, too
context.use(sessionsMiddleware({
  transport: [
    headerTransport('x-session-id'), // or just 'header' for defaults
    cookieTransport({secret: 'keyboardcat'}) // or 'cookie' for defaults
  ],
  storage: jwtStorage({
    secret: 'keyboardcat',
    type: 'HS512',
    expiry: 60 // minutes
  })
}));

context.use('/todos', todosRouter);
context.use('/', helloWorldRouter);
