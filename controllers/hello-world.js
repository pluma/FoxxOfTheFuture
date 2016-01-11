const createRouter = require('@arangodb/foxx/router');
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
  const helloWorldUrl = req.reverse('hello', {name: 'World'});
  // req.reverse can look up any mounted route by name and params
  res.redirect(helloWorldUrl);
});
