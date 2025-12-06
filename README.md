# XENO - Shopify Analytics Backend

A multi-tenant backend system for syncing and analyzing Shopify store data. This application provides RESTful APIs for authentication, data synchronization, and analytics reporting.


## Test Credentials

For testing purposes, a pre-configured test account is available. You can use these credentials to **directly log in** without registration:

**Email:** `ayush@test.com`  
**Password:** `123456`

### Quick Login

Simply use these credentials in the login form or via the login API endpoint:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "ayush@test.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "ayush@test.com"
  }
}
```

After successful login, use the returned JWT token in the Authorization header for all authenticated API requests:

```bash
Authorization: Bearer <your-jwt-token-here>
```

> **Note:** These credentials are pre-configured in the database and ready to use immediately. No registration required.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Known Limitations](#known-limitations)
- [Test Credentials](#test-credentials)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your-secret-key-here
   ```

4. **Set up the database:**
   - Create a PostgreSQL database
   - Run the migration script:
     ```bash
     psql -U username -d database_name -f db/migrations.sql
     ```
   - Or execute the SQL file directly in your PostgreSQL client

5. **Test database connection:**
   ```bash
   node test-db.js
   ```

6. **Start the server:**
   ```bash
   node index.js
   ```

   The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Health Check

Verify the server is running by accessing:
```
GET http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Frontend)                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Express.js Server                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                         │  │
│  │  • CORS                                               │  │
│  │  • JSON Parser                                        │  │
│  │  • Authentication Middleware                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Route Handlers                           │  │
│  │  • /api/auth     → Authentication                     │  │
│  │  • /api/tenants  → Tenant Management                  │  │
│  │  • /api/sync     → Data Synchronization               │  │
│  │  • /api/analytics → Analytics & Reporting             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controller Layer                         │  │
│  │  • authController      • tenantController             │  │
│  │  • syncController      • analyticsController          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Service Layer                            │  │
│  │  • shopify.js (Shopify API Integration)               │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────┐                    ┌────────▼────────┐
│  PostgreSQL    │                    │   Shopify API   │
│  Database      │                    │   (External)    │
│                │                    │                 │
│  • tenants     │                    │  • Customers    │
│  • users       │                    │  • Products     │
│  • customers   │                    │  • Orders       │
│  • products    │                    │                 │
│  • orders      │                    │                 │
│  • order_items │                    │                 │
│  • sync_logs   │                    │                 │
└────────────────┘                    └─────────────────┘
```

### Component Flow

1. **Authentication Flow:**
   - User registers/logs in → JWT token generated → Token stored client-side
   - Subsequent requests include token in Authorization header
   - Middleware validates token and attaches user/tenant info to request

2. **Data Sync Flow:**
   - User triggers sync → System fetches data from Shopify API
   - Data is transformed and stored in PostgreSQL
   - Sync logs are created to track sync status

3. **Analytics Flow:**
   - User requests analytics → Controller queries PostgreSQL
   - Aggregated data is returned to client

## API Endpoints

### Authentication Endpoints

#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "storeName": "My Store",
    "storeUrl": "mystore.myshopify.com",
    "accessToken": "shpat_xxxxxxxxxxxxx"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful",
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
  ```

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
  ```

#### Get Profile
- **Endpoint:** `GET /api/auth/profile`
- **Authentication:** Required (Bearer token)
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "store_name": "My Store",
      "store_url": "mystore.myshopify.com"
    }
  }
  ```

### Tenant Endpoints

#### Get Tenant Status
- **Endpoint:** `GET /api/tenants/status`
- **Authentication:** Required (Bearer token)
- **Response:**
  ```json
  {
    "tenant": {
      "store_name": "My Store",
      "store_url": "mystore.myshopify.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "counts": {
      "customers": 150,
      "products": 50,
      "orders": 200
    },
    "lastSync": {
      "created_at": "2024-01-15T10:30:00.000Z",
      "status": "completed"
    }
  }
  ```

### Sync Endpoints

#### Trigger Full Sync
- **Endpoint:** `POST /api/sync/trigger`
- **Authentication:** Required (Bearer token)
- **Response:**
  ```json
  {
    "message": "Sync completed",
    "synced": {
      "customers": 150,
      "products": 50,
      "orders": 200
    }
  }
  ```

#### Get Sync Logs
- **Endpoint:** `GET /api/sync/logs`
- **Authentication:** Required (Bearer token)
- **Response:**
  ```json
  {
    "logs": [
      {
        "id": 1,
        "tenant_id": 1,
        "sync_type": "full",
        "status": "completed",
        "records_synced": 400,
        "error_message": null,
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
  ```

### Analytics Endpoints

#### Get Overview
- **Endpoint:** `GET /api/analytics/overview`
- **Authentication:** Required (Bearer token)
- **Response:**
  ```json
  {
    "totalCustomers": 150,
    "totalOrders": 200,
    "totalRevenue": 50000.00,
    "totalProducts": 50,
    "avgOrderValue": "250.00"
  }
  ```

#### Get Orders by Date
- **Endpoint:** `GET /api/analytics/orders?from=2024-01-01&to=2024-01-31`
- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `from` (optional): Start date (YYYY-MM-DD)
  - `to` (optional): End date (YYYY-MM-DD)
- **Response:**
  ```json
  {
    "data": [
      {
        "date": "2024-01-15",
        "orders": 10,
        "revenue": 2500.00
      }
    ]
  }
  ```

#### Get Top Customers
- **Endpoint:** `GET /api/analytics/top-customers?limit=5`
- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `limit` (optional): Number of customers to return (default: 5)
- **Response:**
  ```json
  {
    "customers": [
      {
        "id": 1,
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "order_count": 15,
        "total_spent": 5000.00
      }
    ]
  }
  ```

#### Get Revenue Trend
- **Endpoint:** `GET /api/analytics/revenue-trend?period=daily|weekly|monthly`
- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `period` (optional): Aggregation period - "daily", "weekly", or "monthly" (default: "daily")
- **Response:**
  ```json
  {
    "period": "daily",
    "data": [
      {
        "period": "2024-01-15T00:00:00.000Z",
        "revenue": 2500.00,
        "orders": 10
      }
    ]
  }
  ```

#### Get Top Products
- **Endpoint:** `GET /api/analytics/top-products?limit=5`
- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `limit` (optional): Number of products to return (default: 5)
- **Response:**
  ```json
  {
    "products": [
      {
        "id": 1,
        "title": "Product Name",
        "price": 99.99,
        "units_sold": 50,
        "revenue": 4999.50
      }
    ]
  }
  ```

#### Get Order Status
- **Endpoint:** `GET /api/analytics/order-status`
- **Authentication:** Required (Bearer token)
- **Response:**
  ```json
  {
    "financial": [
      {
        "financial_status": "paid",
        "count": 180
      },
      {
        "financial_status": "pending",
        "count": 20
      }
    ],
    "fulfillment": [
      {
        "fulfillment_status": "fulfilled",
        "count": 150
      },
      {
        "fulfillment_status": "unfulfilled",
        "count": 50
      }
    ]
  }
  ```

### Health Check

#### Health Check
- **Endpoint:** `GET /health`
- **Authentication:** Not required
- **Response:**
  ```json
  {
    "status": "ok"
  }
  ```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│   tenants   │
├─────────────┤
│ id (PK)     │
│ store_name  │
│ store_url   │
│ access_token│
│ created_at  │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐      ┌─────────────┐
│    users    │      │  customers  │
├─────────────┤      ├─────────────┤
│ id (PK)     │      │ id (PK)     │
│ tenant_id   │──────┤ tenant_id   │
│ email       │      │ shopify_id  │
│ password    │      │ email       │
│ created_at  │      │ first_name  │
└─────────────┘      │ last_name   │
                     │ phone       │
                     │ total_spent │
                     │ created_at  │
                     └──────┬──────┘
                            │
                            │ 1:N
                            │
                     ┌──────▼──────┐
                     │   orders    │
                     ├─────────────┤
                     │ id (PK)     │
                     │ tenant_id   │
                     │ shopify_id  │
                     │ customer_id │
                     │ order_number│
                     │ total_price │
                     │ financial_  │
                     │   status    │
                     │ fulfillment_│
                     │   status    │
                     │ order_date  │
                     │ created_at  │
                     └──────┬──────┘
                            │
                            │ 1:N
                            │
                     ┌──────▼──────────┐      ┌─────────────┐
                     │  order_items    │      │  products   │
                     ├─────────────────┤      ├─────────────┤
                     │ id (PK)         │      │ id (PK)     │
                     │ tenant_id       │      │ tenant_id   │
                     │ order_id        │──────┤ shopify_id  │
                     │ product_id      │──────┤ title       │
                     │ quantity        │      │ vendor      │
                     │ price           │      │ product_type│
                     └─────────────────┘      │ price       │
                                              │ created_at  │
                                              └─────────────┘

┌─────────────┐
│ sync_logs   │
├─────────────┤
│ id (PK)     │
│ tenant_id   │
│ sync_type   │
│ status      │
│ records_    │
│   synced    │
│ error_      │
│   message   │
│ created_at  │
└─────────────┘
```

### Table Descriptions

#### `tenants`
Stores Shopify store information and access tokens.
- **Primary Key:** `id`
- **Unique Constraints:** `store_url`

#### `users`
Stores user accounts linked to tenants.
- **Primary Key:** `id`
- **Foreign Key:** `tenant_id` → `tenants(id)`
- **Unique Constraints:** `email`

#### `customers`
Stores customer data synced from Shopify.
- **Primary Key:** `id`
- **Foreign Key:** `tenant_id` → `tenants(id)`
- **Unique Constraints:** `(tenant_id, shopify_id)`

#### `products`
Stores product data synced from Shopify.
- **Primary Key:** `id`
- **Foreign Key:** `tenant_id` → `tenants(id)`
- **Unique Constraints:** `(tenant_id, shopify_id)`

#### `orders`
Stores order data synced from Shopify.
- **Primary Key:** `id`
- **Foreign Keys:** 
  - `tenant_id` → `tenants(id)`
  - `customer_id` → `customers(id)`
- **Unique Constraints:** `(tenant_id, shopify_id)`

#### `order_items`
Stores individual line items for each order.
- **Primary Key:** `id`
- **Foreign Keys:**
  - `tenant_id` → `tenants(id)`
  - `order_id` → `orders(id)`
  - `product_id` → `products(id)`

#### `sync_logs`
Tracks synchronization operations and their status.
- **Primary Key:** `id`
- **Foreign Key:** `tenant_id` → `tenants(id)`

### Indexes

The following indexes are created for performance optimization:
- `idx_customers_tenant` on `customers(tenant_id)`
- `idx_products_tenant` on `products(tenant_id)`
- `idx_orders_tenant` on `orders(tenant_id)`
- `idx_orders_date` on `orders(order_date)`
- `idx_order_items_tenant` on `order_items(tenant_id)`

## Known Limitations

### Data Synchronization

1. **Pagination Limits:**
   - The Shopify API integration currently fetches a maximum of 250 records per entity type (customers, products, orders) per sync operation.
   - For stores with more than 250 records, only the first 250 will be synced.
   - **Workaround:** Implement pagination handling to fetch all records in batches.

2. **Incremental Sync:**
   - The current implementation performs full syncs only. There is no incremental/delta sync capability.
   - Each sync operation re-fetches and updates all records, which can be inefficient for large datasets.

3. **Rate Limiting:**
   - The system does not implement Shopify API rate limiting handling.
   - High-frequency sync operations may hit Shopify's rate limits (40 requests per app per store per minute for REST API).

4. **Error Recovery:**
   - If a sync fails partway through, there is no automatic retry mechanism.
   - Failed syncs are logged but require manual intervention to retry.

### Data Storage

1. **Product Variants:**
   - Only the first variant's price is stored for products.
   - Product variants are not fully represented in the database schema.

2. **Order Items:**
   - Order items are deleted and re-inserted on each sync, which may cause data inconsistency if sync fails mid-operation.

3. **Historical Data:**
   - No soft deletes or historical tracking. Deleted records in Shopify will remain in the database until manually removed.

### Authentication & Security

1. **Token Expiration:**
   - JWT tokens expire after 7 days. No refresh token mechanism is implemented.
   - Users must re-login after token expiration.

2. **Password Policy:**
   - No password strength requirements or validation rules.

3. **Access Token Storage:**
   - Shopify access tokens are stored in plain text in the database.
   - Consider encrypting sensitive tokens for enhanced security.

### API Limitations

1. **Query Parameters:**
   - Date range queries in analytics endpoints do not validate date formats or ranges.
   - Invalid dates may cause SQL errors.

2. **Response Pagination:**
   - Analytics endpoints do not implement pagination for large result sets.
   - This may cause performance issues with large datasets.

3. **Concurrent Requests:**
   - Multiple sync requests for the same tenant are not prevented, which may cause data inconsistency.

### Assumptions

1. **Shopify API Version:**
   - The system assumes Shopify API version `2024-01`. This may need to be updated as Shopify deprecates older API versions.

2. **Database:**
   - Assumes PostgreSQL database with support for JSON operations and standard SQL features.

3. **Timezone:**
   - All timestamps are stored in UTC. Date-based queries assume UTC timezone.

4. **Multi-tenancy:**
   - Each user belongs to exactly one tenant. Multi-tenant access for a single user is not supported.

5. **Data Consistency:**
   - Assumes Shopify store data remains relatively stable between syncs.
   - No real-time webhook integration for immediate updates.



## Author

Ayush Kumar Singh


