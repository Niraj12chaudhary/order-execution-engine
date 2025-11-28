 Backend Architecture & Design Decisions
1. Asynchronous Architecture (Producer-Consumer)
I designed the system to be non-blocking. Instead of processing orders immediately (which would freeze the API), the server pushes incoming orders into a Redis Queue (BullMQ). Background workers pick them up independently, ensuring the API remains fast and responsive even under heavy load.

2. High-Performance Server (Fastify)
I chose Fastify over Express because of its superior performance benchmarks and lower overhead. It handles JSON serialization much faster and has excellent native support for WebSockets, which simplified the real-time update logic.

3. Reliability & Type Safety (Prisma + Zod)
Financial apps can't afford bad data.

Zod validates every request at the door—if the amount is negative or tokens are missing, the request is rejected immediately.

Prisma ORM with PostgreSQL ensures ACID compliance. I used native Enums for order status (PENDING, CONFIRMED) to prevent invalid states from ever entering the database.

4. Smart DEX Routing (Strategy Pattern)
To handle routing logic, I used the Strategy Pattern. The worker queries multiple DEXs (Raydium & Meteora) concurrently using Promise.all. It compares the quotes in real-time and automatically executes the trade on the venue offering the best price, simulating real-world aggregation.

5. Real-Time Updates (Redis Pub/Sub)
Since the Worker (processing the order) and the WebSocket Server (connected to the user) run separately, they don't share memory. I used Redis Pub/Sub as a bridge. The worker publishes an event when a status changes, and the WebSocket server listens to it and instantly pushes the update to the client.

6. Scalable Infrastructure (Docker)
The entire backend is containerized using Docker. This separates the API service, the Background Worker, and the Database into their own isolated environments, mimicking a production microservices setup.


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
