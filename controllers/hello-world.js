const context = require('@foxx/context'); // magic
const createRouter = require('@foxx/router');
const routes = createRouter();
module.exports = routes;

/**
 * Hello world
 */ // magical comments are problematic tho
routes.get('/:name', (req, res) => {
  res.send(`Hello ${req.pathParams.name}`);
}, 'hello'); // route names are context-specific;

/**
 * Redirect to Hello World route
 */
routes.get('/', (req, res) => {
  const helloWorldUrl = context.route('hello', {name: 'World'});
  // context.route can look up any mounted route by name and params
  res.redirect(helloWorldUrl);
});
