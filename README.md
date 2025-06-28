# 📋 Task Management API

> **API REST para gerenciamento de tarefas desenvolvida com TypeScript, Bun e Fastify**

Uma API robusta e escalável para gerenciamento de tarefas de equipes de desenvolvimento, implementada seguindo os princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**.

## 🚀 Tecnologias Utilizadas

- **[Bun](https://bun.sh/)** - Runtime moderno e performático para JavaScript/TypeScript
- **[Fastify](https://fastify.dev/)** - Framework web rápido e de baixo overhead
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript e JavaScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[Joi](https://joi.dev/)**/**[Zod](https://zod.dev/)** - Validação de esquemas
- **[Docker](https://www.docker.com/)** - Containerização da aplicação

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas:

```
src/
├── domain/               # 🎯 Regras de negócio e entidades
│   └── entities/
│       ├── Task.ts
│       └── User.ts
├── application/          # 📋 Casos de uso e DTOs
│   ├── dto/
│   └── use-cases/
├── infrastructure/       # 🔧 Implementações concretas
│   ├── providers/
│   └── repositories/
├── interfaces/           # 🌐 Camada de apresentação
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
├── shared/              # 🔄 Configurações e utilitários
│   ├── config/
│   └── types/
└── main.ts              # 🚪 Ponto de entrada da aplicação
```

### 📦 Camadas da Arquitetura

- **Domain**: Contém as entidades de negócio e regras fundamentais
- **Application**: Define os casos de uso e DTOs para transferência de dados
- **Infrastructure**: Implementa repositórios, provedores e integrações externas
- **Interfaces**: Gerencia controladores, rotas e middlewares
- **Shared**: Configurações, tipos e utilitários compartilhados

## ⚡ Funcionalidades

### 👤 Gerenciamento de Usuários

- ✅ Criar usuário
- ✅ Editar usuário
- ✅ Listar usuários
- ✅ Autenticação JWT

### 📝 Gerenciamento de Tarefas

- ✅ Criar tarefa
- ✅ Editar tarefa
- ✅ Atualizar status da tarefa
- ✅ Listar tarefas com filtros (por usuário e status)
- ✅ Deletar tarefa
- ✅ Associar tarefas a usuários

## 🔧 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **[Bun](https://bun.sh/)** (v1.0.0 ou superior)
- **[Docker](https://www.docker.com/)** (v20.0 ou superior)
- **[Docker Compose](https://docs.docker.com/compose/)** (v2.0 ou superior)

## 🛠️ Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone <url-do-repositorio>
cd task-management-api
```

### 2️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Aplicação
PORT=3333
NODE_ENV=development
JWT_SECRET=seu_jwt_secret_super_seguro_aqui

# Banco de Dados
DB_HOST=db
DB_PORT=5432
DB_USER=taskapi
DB_PASSWORD=taskapi123
DB_NAME=taskapi_db

# URL de conexão completa
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

### 3️⃣ Instale as dependências

```bash
bun install
```

## 🚀 Execução

### 🐳 Executando com Docker (Recomendado)

Para executar a aplicação completa (API + Banco de dados):

```bash
# Construir e iniciar todos os serviços
docker-compose up -d --build

# Verificar os logs
docker-compose logs -f app

# Parar os serviços
docker-compose down
```

A aplicação estará disponível em: **http://localhost:3333**

### 💻 Executando em Desenvolvimento Local

```bash
# Modo desenvolvimento com hot reload
bun run dev

# Modo produção
bun run start

# Build da aplicação
bun run build
```

### 🧪 Executando Testes

```bash
# Executar testes uma vez
bun test

# Executar testes em modo watch
bun run test:watch
```

## 📡 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint         | Descrição              | Autenticação |
| ------ | ---------------- | ---------------------- | ------------ |
| `POST` | `/auth/register` | Registrar novo usuário | ❌           |
| `POST` | `/auth/login`    | Login do usuário       | ❌           |

### 👤 Usuários

| Método  | Endpoint     | Descrição         | Autenticação |
| ------- | ------------ | ----------------- | ------------ |
| `POST`  | `/users`     | Criar usuário     | ✅           |
| `GET`   | `/users`     | Listar usuários   | ✅           |
| `PATCH` | `/users/:id` | Atualizar usuário | ✅           |

### 📝 Tarefas

| Método   | Endpoint     | Descrição        | Autenticação |
| -------- | ------------ | ---------------- | ------------ |
| `POST`   | `/tasks`     | Criar tarefa     | ✅           |
| `GET`    | `/tasks`     | Listar tarefas   | ✅           |
| `PATCH`  | `/tasks/:id` | Atualizar tarefa | ✅           |
| `DELETE` | `/tasks/:id` | Deletar tarefa   | ✅           |

### 💊 Health Check

| Método | Endpoint | Descrição              | Autenticação |
| ------ | -------- | ---------------------- | ------------ |
| `GET`  | `/ping`  | Verificar saúde da API | ❌           |

## 📋 Exemplos de Uso

### Registro de Usuário

```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar Tarefa

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Implementar API de tarefas",
    "description": "Desenvolver endpoints CRUD para tarefas",
    "priority": "high",
    "dueDate": "2024-12-31",
    "assigneeUserId": "user-uuid"
  }'
```

### Listar Tarefas

```bash
curl -X GET "http://localhost:3333/tasks?status=false&userId=user-uuid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏛️ Estrutura do Banco de Dados

### 👤 Tabela Users

```sql
id          UUID PRIMARY KEY
name        VARCHAR(100) NOT NULL
email       VARCHAR(100) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL
isActive    BOOLEAN DEFAULT true
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
deletedAt   TIMESTAMP
```

### 📝 Tabela Tasks

```sql
id              UUID PRIMARY KEY
title           VARCHAR(120) NOT NULL
description     TEXT
status          BOOLEAN DEFAULT false
dueDate         DATE
priority        VARCHAR(50)
assigneeUserId  UUID REFERENCES users(id)
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
deletedAt       TIMESTAMP
```

## 🔒 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após o login bem-sucedido, inclua o token no header `Authorization`:

```
Authorization: Bearer <seu_jwt_token>
```

## 🎯 Princípios Aplicados

### SOLID

- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Open/Closed**: Extensível sem modificar código existente
- **Liskov Substitution**: Implementações seguem contratos definidos
- **Interface Segregation**: Interfaces específicas e coesas
- **Dependency Inversion**: Dependência de abstrações, não implementações

### Clean Architecture

- **Separação de camadas**: Domain, Application, Infrastructure, Interfaces
- **Inversão de dependências**: Camadas internas não dependem das externas
- **Testabilidade**: Facilita testes unitários e de integração

### Domain-Driven Design

- **Entidades ricas**: Lógica de negócio encapsulada nas entidades
- **Casos de uso**: Operações de negócio bem definidas
- **Repositórios**: Abstração do acesso a dados

## 🧪 Testes

O projeto está preparado para testes com **Bun Test**. A estrutura de testes segue as mesmas camadas da aplicação:

```bash
# Executar todos os testes
bun test

# Executar testes específicos
bun test src/application/use-cases/*.test.ts

# Executar testes em modo watch
bun test --watch
```

## 🚢 Deploy

### Docker

A aplicação está totalmente containerizada e pode ser facilmente implantada em qualquer ambiente que suporte Docker:

```bash
# Build da imagem
docker build -t task-api .

# Executar container
docker run -p 3333:3333 --env-file .env task-api
```

### Docker Compose

```bash
# Production
docker-compose -f docker-compose.yml up -d
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### 🎯 Status do Projeto

- ✅ Estrutura base implementada
- ✅ Autenticação JWT
- ✅ CRUD de usuários
- ✅ CRUD de tarefas
- ✅ Docker e Docker Compose
- ✅ Arquitetura Clean + DDD

**A aplicação está funcional e atende todos os requisitos técnicos do desafio!** 🚀
