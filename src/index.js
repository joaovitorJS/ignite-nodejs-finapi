const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// Middleware de verificação de conta
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Custumer not found" });
  }

  request.customer = customer;

  return next();
}


/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - [] 
 */
app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  
  const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (customersAlreadyExists) {
    return response.status(400).json({ error: "Customers already exists!" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });

  response.status(201).send();
});


// app.use(verifyIfExistsAccountCPF); outra forma de passar o middleware para as rotas, porém neste caso, esse middleware será aplicada em todas as rotas.

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {

  const { customer } = request;
  

  return response.json(customer.statement);
});

app.listen(3333);