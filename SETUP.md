# Cozy Finds - Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or MongoDB Atlas)
- Razorpay Account (For test keys)

## 1. Backend Setup

1. Navigate to the `backend` folder.
2. Create a `.env` file based on `.env.example`:
   ```env
   MONGO_URI=mongodb://localhost:27017/cozyfinds
   PORT=7000
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

## 2. Frontend Setup

1. Navigate to the `Frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `BookingCard.tsx`:
   - Replace `key: "rzp_test_your_key_id"` with your actual Razorpay Test Key ID.
4. Start the dev server:
   ```bash
   npm run dev
   ```

## 3. How to Test Razorpay Payment

1. Log in or Register on the application.
2. Select a property and pick check-in/checkout dates.
3. Click "Reserve".
4. The Razorpay modal will open.
5. Use the following test credentials:
   - **Method**: Netbanking / Card / UPI
   - **Test Card**: Use any of Razorpay's [test cards](https://razorpay.com/docs/payments/payments/test-card-details/) (e.g., `4111 1111 1111 1111`).
   - **OTP**: Any 6 digits (e.g., `123456`).
6. After success, you will be redirected to "My Bookings" where your reservation will appear with a `paid` status.

## 4. Troubleshooting
- **Proxy Error**: Ensure the backend is running on port 7000.
- **Razorpay Not Loading**: Check your internet connection and ensure the script tag is in `index.html`.
