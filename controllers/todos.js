const _ = require('lodash'); // let's replace underscore with lodash
const joi = require('joi');
const db = require('@arangodb/db');
const fs = require('@arangodb/fs');
const context = require('@foxx/context'); // magic
const createRouter = require('@foxx/router');
const routes = createRouter();
module.exports = routes;

const Todos = db._collection(context.prefix('todos'));
const TodoType = {
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
  res.send(todo); // sets the response body
})
.description( // no more magical comments
  'Save a todo'
)
.body( // for the request body:
  TodoType, // TodoType.fromClient + schema is applied
  'Todo item to save'
)
.response( // for the response body:
  TodoType, // TodoType.forClient is applied
  'Todo item that was saved'
);


routes.get((req, res) => { // path is optional for "/"
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
  TodoType.schema.completed.allow(null).default(null),
  'Filter by completed status'
)
.response(
  [TodoType], // array of TodoType items
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
  TodoType,
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
  TodoType,
  'Todo info to replace the todo item with'
)
.response(
  TodoType,
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
  TodoType.schema.title,
  'New title of the todo item'
)
.response(
  TodoType,
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
  TodoType.schema.completed,
  'Whether the todo item was completed'
)
.response(
  TodoType,
  'Todo item that was updated'
);


// Express-style middleware (but non-async)
itemRoutes.use('/legacy/detail', (req, res, next) => {
  const key = req.pathParams.key;
  req.rewrite('todos.detail', {key});
  // Request will now be processed as if it was
  // GET /todos/:key
  next();
  // Here we can do post-processing if necessary
  // BTW: router.use does not generate Swagger docs
});


routes.get('/favicon.ico', (req, res) => {
  const buf = fs.readFileSync(context.filename('app.ico'));
  res.set('content-type', 'image/x-icon');
  res.send(buf); // buffers are not converted to JSON (duh)
})
.response(
  'image/x-icon', // string value implies MIME type (docs only)
  'Bookmark icon for the todo service'
);
