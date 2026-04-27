# 🚲 Bike Rental Server

A lightweight REST API built with **Node.js** (zero external dependencies) that serves bike rental data with support for filtering by type and price via both **path parameters** and **query parameters**.

---

## 📁 Project Structure

```
Bike_Rental_Server/
├── data/
│   └── bikeData.json          # Static bike inventory data
├── handlers/
│   └── routeHandlers.js       # Route matching and request dispatching
├── utils/
│   ├── getData.js             # Reads and parses bikeData.json
│   ├── getDataByPathParams.js # Filters bikes by path segment value
│   ├── getDataByQueryParams.js# Filters bikes by query string params
│   └── sendResponse.js        # Helper to write HTTP responses
├── server.js                  # Entry point — creates and starts the HTTP server
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (uses native ESM and `node:` built-ins)

### Installation

```bash
# No dependencies to install — this project uses only Node.js built-ins
git clone https://github.com/abhay0480-eng/BIke_Rental_Server.git
cd Bike_Rental_Server
```

### Running the Server

```bash
npm start
```

The server starts on **port 8000**:

```
Server is running on PORT 8000
```

---

## 📡 API Reference

Base URL: `http://localhost:8000`

---

### `GET /api`

Returns all bikes. Supports optional query parameters for filtering.

#### Query Parameters

| Parameter | Type   | Description                                      | Example          |
|-----------|--------|--------------------------------------------------|------------------|
| `type`    | string | Filter by bike type (`simple`, `rugged`, `luxury`) | `?type=rugged`   |
| `price`   | number | Filter by exact rental price                     | `?price=130`     |

Both parameters can be combined:

```
GET /api?type=luxury&price=200
```

#### Example Response

```json
[
  {
    "id": "6",
    "name": "The Velvet Cruiser",
    "price": 200,
    "description": "Luxury meets the open road...",
    "imageUrl": "https://...",
    "type": "luxury"
  }
]
```

---

### `GET /api/type/:type`

Returns all bikes matching the given `type` path segment.

| Segment | Values                       |
|---------|------------------------------|
| `:type` | `simple`, `rugged`, `luxury` |

```
GET /api/type/rugged
```

---

### `GET /api/price/:price`

Returns all bikes matching the given `price` path segment.

```
GET /api/price/130
```

---

### Error Responses

| Status | Body                              | Condition                  |
|--------|-----------------------------------|----------------------------|
| `404`  | `{"error": "Route Not Found"}`    | No matching route          |
| `405`  | `{"error": "Method Not Allowed"}` | Non-GET request            |
| `500`  | `{"error": "Internal Server Error"}` | Unexpected server error |

---

## 🗂️ Data Schema

Each bike object in `data/bikeData.json` has the following shape:

```json
{
  "id": "1",
  "name": "The Modest Explorer",
  "price": 60,
  "description": "A no-fuss adventure companion...",
  "imageUrl": "https://...",
  "type": "simple"
}
```

| Field         | Type   | Description                              |
|---------------|--------|------------------------------------------|
| `id`          | string | Unique identifier                        |
| `name`        | string | Bike model name                          |
| `price`       | number | Daily rental price (in currency units)   |
| `description` | string | Marketing description                    |
| `imageUrl`    | string | Cloudinary-hosted image URL              |
| `type`        | string | Category: `simple`, `rugged`, or `luxury`|

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ESM modules — `"type": "module"`)
- **HTTP**: `node:http` built-in module
- **File I/O**: `node:fs/promises` + `node:path`
- **Dependencies**: None

---

## 👤 Author

**Abhay** — [GitHub](https://github.com/abhay0480-eng)
