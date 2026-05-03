# Admin Panel - Technical Guide

## 1. Role-Based Access Control
- I have added a `role` field to the **User Model** (`user` or `admin`).
- Created an **Admin Middleware** on the backend to protect sensitive routes.
- The **Admin Layout** on the frontend prevents non-admin users from accessing the dashboard.

## 2. Setting Up an Admin User
Since the registration page defaults to the `user` role, you need to manually promote a user to `admin` in MongoDB:

1. Open your MongoDB shell or Compass.
2. Find the user record you want to promote.
3. Update the `role` field from `"user"` to `"admin"`.
   ```javascript
    db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
    ```

4. **Default Admin Credentials (via Seeder):**
   - **Email:** `admin@example.com`
   - **Password:** `admin123`
   - *Note: I have already run the seeder script for you.*

## 3. Admin Features
- **Dashboard**: View summary stats (Total Revenue, Users, Hotels, Bookings).
- **Hotel Management**: 
  - List all properties.
  - Delete properties directly from the table.
  - (Ready for Image Upload) Integrated with the existing Cloudinary upload middleware.
- **User Management**:
  - View all registered users.
  - Delete user accounts (Admin accounts are protected from deletion).
- **Booking Overview**: Monitor all paid reservations across the platform.

## 4. API Testing (Postman)
- **Get Stats**: `GET /api/admin/stats` (Requires Admin Token)
- **List Users**: `GET /api/admin/users`
- **Delete Hotel**: `DELETE /api/listings/:id`
- **Register**: `POST /api/auth/signup` (Creates a standard user)

## 5. Local Development
1. Ensure **Backend** is running: `npm run dev` in `/backend`.
2. Ensure **Frontend** is running: `npm run dev` in `/Frontend`.
3. Log in with your admin credentials.
4. Access the **Admin Panel** via the user menu in the top-right navbar.
