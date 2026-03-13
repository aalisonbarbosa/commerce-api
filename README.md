# 🛒 E-commerce API

![Node](https://img.shields.io/badge/node.js-20-green)
![Fastify](https://img.shields.io/badge/framework-fastify-black)
![Prisma](https://img.shields.io/badge/orm-prisma-blue)
![PostgreSQL](https://img.shields.io/badge/database-postgresql-blue)
![License](https://img.shields.io/badge/license-MIT-green)

API REST de um sistema de **e-commerce**.

O projeto implementa um fluxo completo de compra, incluindo autenticação, gerenciamento de produtos, carrinho, pedidos e pagamentos.

---

# 📦 Funcionalidades

### 🔐 Autenticação

* Registro de usuário
* Login com JWT
* Autenticação por cookie
* Proteção de rotas privadas

### 📦 Produtos

* Listar produtos
* Buscar produto por ID
* Criar produto (admin)
* Atualizar produto (admin)
* Deletar produto (admin)

### 🛒 Carrinho

* Visualizar carrinho
* Adicionar produto ao carrinho
* Remover produto do carrinho
* Diminuir quantidade do produto

### 📑 Pedidos

* Criar pedido baseado no carrinho
* Listar pedidos do usuário
* Confirmar pagamento

---

# ⚙️ Tecnologias

* Node.js
* Fastify
* Prisma ORM
* PostgreSQL
* JWT
* Zod
* Swagger
* Bcrypt

---

# 🏗 Arquitetura

O projeto segue uma arquitetura baseada em **Controller → Service → Database**.

```
Client
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
```

---

# 🗂 Estrutura do projeto

```
src
 ├ controllers
 │   ├ auth.ts
 │   ├ product.ts
 │   ├ cart.ts
 │   └ order.ts
 │
 ├ services
 │   ├ user.ts
 │   ├ product.ts
 │   ├ cart.ts
 │   ├ order.ts
 │   └ payment.ts
 │
 ├ routes
 │   ├ auth.ts
 │   ├ products.ts
 │   ├ cart.ts
 │   └ orders.ts
 │
 ├ plugins
 │   └ auth.ts
 │
 ├ lib
 │   └ prisma.ts
 │
 └ server.ts
```

---

# 🧠 Modelo do Banco de Dados

```
User
 ├ id
 ├ name
 ├ email
 ├ password
 └ role

Product
 ├ id
 ├ name
 ├ description
 ├ price
 ├ quantity
 └ userId

Cart
 ├ id
 └ userId

CartItem
 ├ id
 ├ cartId
 ├ productId
 └ quantity

Order
 ├ id
 ├ userId
 ├ amount
 └ expiresAt

OrderItem
 ├ id
 ├ orderId
 ├ productId
 ├ quantity
 └ unitPrice

Payment
 ├ id
 ├ orderId
 ├ amount
 └ status
```

---

# 🔄 Fluxo da aplicação

```
Register → Login
      ↓
Browse Products
      ↓
Add to Cart
      ↓
Create Order
      ↓
Confirm Payment
```

---

# 📚 Documentação da API

A API possui documentação interativa via Swagger.

```
http://localhost:3333/docs
```

Com o Swagger você pode:

* visualizar todas as rotas
* testar requisições
* autenticar com JWT

---

# 🔑 Autenticação no Swagger

1. Faça login na rota `/login`
2. Copie o token retornado
3. Clique em **Authorize**
4. Insira:

```
Bearer SEU_TOKEN
```

---

# 🚀 Instalação

Clone o projeto:

```
git clone https://github.com/seuusuario/ecommerce-api
```

Entre na pasta:

```
cd ecommerce-api
```

Instale as dependências:

```
npm install
```

---

# ⚙️ Variáveis de ambiente

Crie um arquivo `.env`

```
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="secret"
```

---

# 🗄 Banco de dados

Gerar client do Prisma:

```
npx prisma generate
```

Rodar migrations:

```
npx prisma migrate dev
```

---

# ▶️ Rodar o projeto

```
npm run dev
```

Servidor disponível em:

```
http://localhost:3333
```

---

# 🔒 Segurança

* Senhas criptografadas com **bcrypt**
* Autenticação com **JWT**
* Validação de dados com **Zod**
* Transações com **Prisma**

---

# 📄 Licença

MIT
