const context = require('@foxx/context'); // magic
const sessionsMiddleware = require('@foxx/sessions'); // replaces activateSessions
const jwtStorage = require('@foxx/sessions/jwt'); // not a Foxx app
const helloWorldRouter = require('./hello-world');
const todosRouter = require('./todos');

// Middleware can be used on the context directly, too
context.use(sessionsMiddleware({
  sessionStorage: jwtStorage({
    secret: 'keyboardcat',
    type: 'HS512'
  }),
  header: 'x-session-id',
  expiry: 60 // minutes
}));

context.mount('/todos', todosRouter);
context.mount('/', helloWorldRouter);
