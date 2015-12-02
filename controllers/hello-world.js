const context = require('@foxx/context'); // magic
const createRouter = require('@foxx/router');
const routes = createRouter();
module.exports = routes;

routes.get('/:name', (req, res) => {
  res.send(`Hello ${req.pathParams.name}`);
}, 'hello') // route names are context-specific
.description(
  'Hello world'
);

routes.get('/', (req, res) => {
  const helloWorldUrl = context.route('hello', {name: 'World'});
  res.redirect(helloWorldUrl);
})
.description(
  'Redirect to Hello World route'
);
