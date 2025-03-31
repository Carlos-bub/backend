# Documentação do Sitema para Barbearia - Back-end

## Introdução

### 1. Objetivo
Sistema desenvolvido para barbearias de médio porte, que moderniza processos manuais como agendamentos, gestão de clientes e trazendo eficiência e organização.

## 1.1 📌 Visão Geral das Tecnologias Utilizadas
Back-end desenvolvido para o sistema de barbearia

- API RESTful (Node.js + Express)
- Banco de Dados (Railway MySQL com Prisma ORM )
- Autenticação (JWT + Bcrypt)
- Gestão de agendamento (Com validações de horário)

----
## 2.Configuração
### 2.1 Pré-requisitos
- Node.js (v18+)
- MySQL 
- Yarn ou NPM
### 2.2 Instalação
```bash
git clone [https://github.com/Carlos-bub/backend.git]
cd backend
npm install
npm run dev
cp .env
```
### 2.3 Configuração do Prisma ORM
```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "SEU_BANCO"
  url      = env("DATABASE_URL")
}

model Agendamento {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String
  telefone  String
  servico   String
  data      DateTime
  hora      DateTime
  status    String   @default("Pendente")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Usuario {
  id       Int     @id @default(autoincrement())
  nome     String
  email    String  @unique
  senha    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Servico {
  id        Int      @id @default(autoincrement())
  nome      String
  codigo    String   @unique
  preco     Float
  duracao   Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
### 3. Váriaveis de Ambiente(`/.env`)
```ini
DATABASE_URL="SEU_BANCO_DE_DADOS" #URL de conexão MySQL
PORT=8080 #Porta de servidor
JWT_SECRET="SUA_CHAVE" # Chave secreta para JWT
EMAIL_HOST= # Host SMTP
EMAIL_PORT=587 # Porta SMTP
EMAIL_USER= # Email do remetente
EMAIL_PASSWORD= # Senha de app do email
```
### 4. Migrações do Banco de Dados
```bash
npx prisma migrate dev
npx prisma generate
```
### 🚀 Execução
---
| Comando               | Descrição                                  |
|-----------------------|--------------------------------------------|
| `npm start`           | Inicia o servidor em produção             |
| `npm run dev`         | Inicia com hot-reload (nodemon)           |

### 📂 Estrutura de Pastas
```bash
src/
├── controllers/     # Lógica das rotas
│   ├── auth.controller.js
│   ├── scheduling.controller.js
├── routes/          # Definição de endpoints
│   ├── auth.routes.js
│   ├── api.routes.js
├── middleware/      # Interceptores
│   ├── auth.js      # Valida JWT
│   ├── errorHandler.js
├── utils/           # Helpers
│   ├── dateUtils.js # Formata datas
│   ├── jwt.js       # Geração de tokens
prisma/
├── schema.prisma   # Modelagem do banco
```
### 🔗 Rotas Principais

## 🌐 *Base URL:*  
`https://backend-production-9519.up.railway.app`

## 🔐 *Autenticação*  
- As *rotas públicas* não exigem autenticação.
- As *rotas protegidas* requerem um *token JWT* no header:  
  `Authorization: Bearer <token>`
- O token é obtido após um login bem-sucedido.

## 📄 *Formato das Respostas:* JSON

---

## 🚀 *Rotas da API*

### 📌 *Rotas Públicas*

#### 🔹 *Agendamentos*

POST /agendamentos

> Cria um novo agendamento


GET /agendamentos/disponibilidade

> Verifica horários disponíveis para uma data

#### 🔹 *Autenticação*

POST /auth/login

> Realiza login do usuário


POST /auth/register

> Registra um novo usuário (admin)

#### 🔹 *Serviços*

GET /servicos

> Lista todos os serviços disponíveis

---

### 🔒 *Rotas Protegidas (Requer Token JWT)*

#### 🔹 *Agendamentos*

GET /agendamentos

> Lista todos os agendamentos


PUT /agendamentos/:id/status

> Atualiza o status de um agendamento


DELETE /agendamentos/:id

> Remove um agendamento específico

#### 🔹 *Serviços*

POST /servicos

> Cria um novo serviço


PUT /servicos/:id

> Atualiza um serviço existente


DELETE /servicos/:id

> Remove um serviço

---

## ⚠ *Observações*
- Todas as respostas são no formato *JSON*.
- Em caso de erro, a resposta incluirá uma mensagem descritiva.
---
### 🛡️ Segurança
- Bcrypt: Hash de senhas antes de Salvar no Banco
- JWT: Tokens com expiração (1h por padrão)
- CORS: Restrito a origens autorizadas
- Validação de Inputs: Sanitização de dados em todas as rotas

### 📦 Dependências

#### Principais
---
|Pacote        | Uso                     |
|--------------|-------------------------|
|Express       | Framework HTTP          |
|prisma        | ORM para MySQL          |
|jsonwebtoken  | Autenticação via JWT    |
|date-fns      | Manipulação de datas    |
### Dev
---
|Pacote        | Uso                     |
|--------------|-------------------------|
|nodemon       | Reinicio Automatico     |
## Licença
ISC License -