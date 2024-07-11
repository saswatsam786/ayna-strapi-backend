const http = require("http");
const socketIo = require("../config/functions/socket");

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    async function start() {
      const app = await strapi;
      const server = http.createServer(strapi.server.app);

      socketIo.init(server, strapi);

      await server.listen(2000, () => {
        strapi.log.info(`Server started on port ${app.config.port}`);
      });
    }

    start();
  },
};
