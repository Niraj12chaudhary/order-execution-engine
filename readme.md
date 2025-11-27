Prerequisites:

Node.js (v18+)

Docker & Docker Compose (For Redis and Postgres)

Installation & Setup
Clone the Repository

git clone git@github.com:Niraj12chaudhary/order-execution-engine.git
cd order-execution-engine

docker-compose up -d

Install Dependencies

npm install

Environment Setup The .env file is pre-configured for the Docker setup.

Code snippet

DATABASE_URL="postgresql://shivam:password123@localhost:5433/order_engine?schema=public"
PORT=3000
Database Migration Sync the Prisma schema with the database:

npx prisma migrate dev --name init
Run the Server Start the development server (API + Worker):

npm run dev

Tech Stack
Runtime: Node.js & TypeScript

Framework: Fastify (Chosen for low overhead and native WebSocket support)

Database: PostgreSQL (with Prisma ORM)

Queue System: BullMQ & Redis

Validation: Zod

API Documentation

1. Execute Order
   Endpoint: POST /api/orders/execute

Description: Submits a new order to the queue.

Body:

JSON

{
"type": "MARKET",
"side": "BUY",
"tokenIn": "USDC",
"tokenOut": "SOL",
"amount": 100
}
Response:

JSON

{
"status": "success",
"data": { "orderId": "uuid-string", "status": "PENDING" }
} 2. Get Order History
Endpoint: GET /api/orders

Description: Fetches the list of recent orders.

3. WebSocket Stream
   URL: ws://localhost:3000/ws/orders

Events: Streams JSON updates whenever an order status changes.

JSON

{
"orderId": "uuid...",
"status": "CONFIRMED",
"txHash": "sol*tx*...",
"executionPrice": 145.50
}
