const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
<<<<<<< HEAD
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes:{
            cors:{
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
=======
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server sedang berjalan pada ${server.info.uri}`);
>>>>>>> 7d47fabb7884272d1ad95009277b87218532cc31
};

init();
