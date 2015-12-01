const context = require('@foxx/context'); // magic
const helloWorldRouter = require('./hello-world');
const todosRouter = require('./todos');

context.mount('/todos', todosRouter);
context.mount('/', helloWorldRouter);
