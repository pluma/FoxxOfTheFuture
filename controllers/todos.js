const _ = require('lodash');
const joi = require('joi');
const db = require('@arangodb/db');
const context = require('@foxx/context'); // magic
const createRouter = require('@foxx/router');
const routes = createRouter();
module.exports = routes;

const Todos = db._collection(context.prefix('todos'));
const TodoModel = {
  schema: {
    title: joi.string().required(),
    completed: joi.boolean().default(false)
  },
  forClient: doc => _.pick(doc, ['_key', 'title', 'completed'])
};


routes.post('/', (req, res) => {
  const meta = Todos.save(req.body);
  const todo = Todos.document(meta);
  res.status(201);
  res.send(todo);
})
.description(
  'Save a todo'
)
.body(
  TodoModel,
  'Todo item to save'
)
.response(
  TodoModel,
  'Todo item that was saved'
);


routes.get('/', (req, res) => {
  let todos;
  if (typeof req.queryParams.completed === 'boolean') {
    todos = Todos.byExample({
      completed: res.queryParams.completed
    });
  }
  else todos = Todos.all();
  res.send(todos);
}, 'todos.list')
.description(
  'List all todos'
)
.queryParam(
  'completed',
  TodoModel.schema.completed.allow(null).default(null),
  'Filter by completed status'
)
.response(
  [TodoModel],
  'Filtered todo items'
);


const itemRoutes = createRouter();

routes.mount('/:key', itemRoutes)
.pathParam(
  'key',
  joi.string().required(),
  'Key of the todo item'
);


itemRoutes.get('/', (req, res) => {
  const key = req.pathParams.key;
  const todo = Todos.document(key);
  res.send(todo);
}, 'todos.detail')
.response(
  TodoModel,
  'The todo item with the given key'
);


itemRoutes.delete('/', (req, res) => {
  const key = req.pathParams.key;
  Todos.remove(key);
  // Not calling res.send implies res.status(204)
})
.description(
  'Remove the todo item'
)
.response(null); // Explicitly enforce no response


itemRoutes.put('/', (req, res) => {
  const key = req.pathParams.key; // pathParams cascade down nested routers
  Todos.replace(key, req.body);
  const todo = Todos.document(key);
  res.send(todo);
})
.description(
  'Replace the todo item'
)
.body(
  TodoModel,
  'Todo info to replace the todo item with'
)
.response(
  TodoModel,
  'Todo item that was updated'
);


itemRoutes.put('/title', (req, res) => {
  const key = req.pathParams.key;
  Todos.update(key, {title: req.body});
  const todo = Todos.document(key);
  res.send(todo);
})
.description(
  'Replace the todo item title'
)
.body(
  TodoModel.schema.title,
  'New title of the todo item'
)
.response(
  TodoModel,
  'Todo item that was updated'
);


itemRoutes.put('/completed', (req, res) => {
  const key = req.pathParams.key;
  Todos.update(key, {completed: req.body});
  const todo = Todos.document(key);
  res.send(todo);
})
.description(
  'Replace the todo item status'
)
.body(
  TodoModel.schema.completed,
  'Whether the todo item was completed'
)
.response(
  TodoModel,
  'Todo item that was updated'
);
