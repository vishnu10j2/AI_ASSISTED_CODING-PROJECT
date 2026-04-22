# 🏨 HotelMS — Hotel Management System

A full-stack web application for managing hotel operations, built with **Node.js (Express)**, **MongoDB**, and **EJS**.

---

## ✨ Features

| Feature | Admin | Resident |
|---|---|---|
| Dashboard with stats | ✅ | ✅ |
| Room management (CRUD) | ✅ | — |
| View available rooms | — | ✅ |
| Booking approval/rejection | ✅ | — |
| Submit booking requests | — | ✅ |
| Complaint management | ✅ | ✅ |
| User management | ✅ | — |
| Profile & password change | ✅ | ✅ |

---

## 📁 Project Structure

```
hotel-management/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── complaintController.js
│   ├── dashboardController.js
│   ├── roomController.js
│   └── userController.js
├── middleware/
│   ├── auth.js                # Role-based access middleware
│   └── flash.js               # Flash messages + user locals
├── models/
│   ├── Booking.js
│   ├── Complaint.js
│   ├── Room.js
│   └── User.js
├── public/
│   ├── css/style.css
│   └── js/main.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── profile.js
│   └── resident.js
├── views/
│   ├── admin/
│   │   ├── bookings.ejs
│   │   ├── complaints.ejs
│   │   ├── dashboard.ejs
│   │   ├── room-form.ejs
│   │   ├── rooms.ejs
│   │   └── users.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── partials/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   ├── head.ejs
│   │   ├── sidebar.ejs
│   │   └── topbar.ejs
│   ├── resident/
│   │   ├── booking-form.ejs
│   │   ├── bookings.ejs
│   │   ├── complaint-form.ejs
│   │   ├── complaints.ejs
│   │   ├── dashboard.ejs
│   │   └── rooms.ejs
│   └── profile.ejs
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## ⚙️ MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account.
2. Click **"Build a Database"** → choose the **Free (M0)** tier.
3. Choose a cloud provider and region, then click **Create**.
4. Under **Security → Database Access**, create a database user with a username and password.
5. Under **Security → Network Access**, click **"Add IP Address"** → **"Allow Access from Anywhere"** (or add your specific IP).
6. In your cluster, click **Connect** → **Connect your application**.
7. Copy the connection string. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<username>` and `<password>` with your database user credentials, and add your database name before `?`:
   ```
   mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/hotel_management?retryWrites=true&w=majority
   ```

---

## 🚀 Running Locally

### 1. Clone / download the project

```bash
git clone <repo-url>
cd hotel-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/hotel_management?retryWrites=true&w=majority
SESSION_SECRET=some_long_random_secret_string
NODE_ENV=development
```

### 4. Create the admin account

The signup page only creates **resident** accounts. To create an admin, you have two options:

**Option A — MongoDB Atlas UI:**
1. Open your cluster in Atlas → **Browse Collections** → `hotel_management` → `users`
2. Find the user you want to promote
3. Click **Edit** and change `"role": "resident"` to `"role": "admin"`
4. Save

**Option B — MongoDB Compass or mongosh:**
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

### 5. Start the server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

### 6. Open in browser

```
http://localhost:3000
```

---

## 🔐 Default Routes

| URL | Access | Description |
|---|---|---|
| `/` | Public | Redirects to login or dashboard |
| `/auth/login` | Guest | Login page |
| `/auth/signup` | Guest | Resident signup |
| `/auth/logout` | Auth | Logout |
| `/dashboard` | Auth | Role-based dashboard |
| `/admin/rooms` | Admin | Room management |
| `/admin/bookings` | Admin | Booking requests |
| `/admin/complaints` | Admin | Complaint management |
| `/admin/users` | Admin | User management |
| `/resident/rooms` | Resident | Browse available rooms |
| `/resident/bookings` | Resident | My booking history |
| `/resident/complaints` | Resident | My complaints |
| `/profile` | Auth | View/edit profile |

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Templating:** EJS
- **Auth:** bcryptjs (password hashing), express-session, connect-mongo
- **Frontend:** Vanilla CSS (custom design system), Font Awesome icons
- **Dev:** nodemon

---

## 📝 Notes

- Sessions are stored in MongoDB via `connect-mongo`, so they persist across server restarts.
- Only one **Pending** booking per resident is allowed at a time.
- When a booking is **Approved**, the room status automatically changes to **Occupied**.
- When a booking is **Rejected**, the room status reverts to **Available**.
