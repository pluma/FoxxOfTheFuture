const context = require('@arangodb/foxx/context'); // magic
const sessionsMiddleware = require('@arangodb/foxx/sessions'); // replaces activateSessions
const headerSessions = require('@arangodb/foxx/sessions/header');
const cookieSessions = require('@arangodb/foxx/sessions/cookie');
const jwtStorage = require('@arangodb/foxx/sessions/jwt'); // not a Foxx app
const helloWorldRouter = require('./hello-world');
const todosRouter = require('./todos');

// Middleware can be used on the context directly, too
context.use(sessionsMiddleware({
  transport: [
    headerSessions('x-session-id'), // or just 'header' for defaults
    cookieSessions({secret: 'keyboardcat'}) // or 'cookie' for defaults
  ],
  storage: jwtStorage({
    secret: 'keyboardcat',
    type: 'HS512',
    expiry: 60 // minutes
  })
}));

context.use('/todos', todosRouter);
context.use('/', helloWorldRouter);
