const context = require('@foxx/context'); // magic
const helloWorldRouter = require('./controllers/hello-world');
const todosRouter = require('./controllers/todos');

context.mount('/todos', todosRouter);
context.mount('/', helloWorldRouter);
