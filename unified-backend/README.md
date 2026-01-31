# HCL Unified Backend

This is a consolidated backend server for the HCL Credit Card Portal. It integrates Authentication (Login) and the Card Application workflow into a single, high-performance service.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   The `.env` file is already configured with the MongoDB URI and Port 5001.

3. **Start the Server**:
   ```bash
   npm run start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login`: Demo login with roles (Admin, Manager1, Manager2)

### Applications
- `POST /api/applications`: Submit a new application
- `GET /api/applications/status?applicationNumber=...`: Check status
- `GET /api/applications/previous?pan=...`: Cooldown check
- `GET /api/applications`: List applications (Search/Filter/Pagination)
- `PATCH /api/applications/:id`: Approve/Evaluate/Reject applications
