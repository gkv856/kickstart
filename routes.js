const routes = require("next-routes")();

routes.add("/campaigns/new", "/campaigns/new");
routes.add("/campaigns/:address", "/campaigns/show");
routes.add("/campaigns/:address/requests/new", "/campaigns/requests/new");
routes.add("/campaigns/:address/requests", "/campaigns/requests/index");

module.exports = routes;
