import { Server } from 'miragejs';

class ServerEdit extends Server {
  constructor(...args) {
    super(...args);

    this.startMessage = () => console.log('Mock-server started!');
  }
}

const MockServer = new ServerEdit({
  routes() {
    this.namespace = 'api';

    this.get('/tasks/', () => [
      {
        name: 'Task 1',
        isDone: false,
        id: 1,
      },
      {
        name: 'Task 2',
        isDone: false,
        id: 2,
      },
    ]);

    this.post('/tasks/', (schema, request) => {
      const { name } = JSON.parse(request.requestBody);
      console.log(`Mock-server: task "${name}" added.`);
    });

    this.delete('/tasks/:id', (schema, request) => {
      const { id } = request.params;
      console.log(`Mock-server: task with id "${id}" deleted.`);
    });

    this.patch('/tasks/:id', (schema, request) => {
      // const { name } = JSON.parse(request.requestBody);
      const { id } = request.params;
      console.log(`Mock-server: task with id "${id}" patched.`);
    });
  },
});

MockServer.startMessage();
