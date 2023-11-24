const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();

server.use(middleware);
server.use(jsonServer.bodyParser);

const todosData = require('../server/data/todos');

server.get('/api/todos', (req, res, next) => {
  res.status(200).send(todosData.getTodos);
})

server.post('/api/todos', (req, res, next) => {
  todosData.getTodos.data.push({id: todosData.getTodos.data.length, ...req.body.newTodo})
  res.status(200).send(todosData.getTodos);
})

server.patch('/api/todos', (req, res, next) => {
  console.log(req.body.editedTodo)
  todosData.getTodos.data = todosData.getTodos.data.map(todo => {
    if(todo.id === req.body.editedTodo.id) {
      return req.body.editedTodo
    } else {
      return todo
    }
  })
  res.status(200).send(todosData.getTodos);
})

server.delete('/api/todos/:id', (req, res, next) => {
  let todoId = parseInt(req.url.split('/').pop());
  todosData.getTodos.data = todosData.getTodos.data.filter(todo => todo.id !== todoId)
  res.status(200).send(todosData.getTodos);
})

server.listen(3000, () => {
  console.log('JSON server listening on port 3000');
})
