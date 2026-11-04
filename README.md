# CampusCloset 🎓

A full-stack peer-to-peer (P2P) student rental and marketplace web application designed specifically for university campuses. Graduating seniors moving out or renting apartments can list dorm gear, appliances, study tables, mattresses, and textbooks to juniors moving in — supporting both **Rental** (daily/monthly with security deposit) and **Sale** (permanent purchase) transactions.

---

## 🚀 Key Features

1. **Dual Transaction Modes**:
   - **For Rent**: Specify daily/monthly rental rates and a refundable security deposit. Built-in interactive date calculator with automatic cost breakdown and return-due countdown alerts.
   - **For Sale**: One-time direct purchase with transparent campus handover locations.
2. **Modern Dark-Mode Aesthetic**:
   - Designed around a refined `#1e1e1e` / `#121212` palette with glassmorphism panels, glowing emerald/violet accents, and responsive layout.
3. **University & Student Verification**:
   - Verified `.edu` status simulation, campus filter (Stanford, UC Berkeley, MIT, Harvard, etc.), and dorm hall location tags.
4. **Interactive Booking & Handover**:
   - Date range selector, security deposit breakdown, campus pickup spot selector, and WhatsApp direct link + in-app campus messaging simulator.
5. **Student Dashboard (`/dashboard`)**:
   - **My Listings**: Manage active listings, toggle availability status (`Available` / `Reserved`), and delete items.
   - **Borrowed Rentals**: Track items in your dorm with active return date countdowns (e.g., *"Due in 14 days"*), and one-click return & deposit refund processing.
   - **Lending Tracker**: Track items currently lent to juniors and manage deposit returns.
   - **Permanent Purchases & Sales**: Review completed buys and sales.
6. **Pre-Seeded Real Campus Marketplace Data**:
   - Seeded with 11 realistic dorm items (mini fridges, ergonomic chairs, calculus textbooks, graphing calculators, monitors, instant pots) and 4 student profiles.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS, custom glassmorphism, glowing utilities, Lucide React icons
- **Database & ORM**: Prisma ORM with SQLite (`prisma/dev.db`) — zero-configuration, reliable, portable local database
- **Authentication**: JWT-based session tokens with HTTP-only cookies, bcryptjs password hashing, and 1-Click Demo student switchers

---

## 📦 Database Schemas (`prisma/schema.prisma`)

### 1. `User`
- `id` (String UUID)
- `name`, `email` (Unique .edu), `password` (Hashed)
- `university` (Default: "Stanford University")
- `phone`, `role` ("Student", "Alum/Senior", "Admin")
- `avatarUrl`, `verifiedStudent` (Boolean)
- `dormLocation`, `bio`
- Relations: `listedItems`, `buyerOrders`, `sellerOrders`, `inquiries`

### 2. `Item`
- `id` (String UUID)
- `title`, `description`
- `category` ("Appliances", "Furniture", "Books", "Electronics", "Others")
- `listingType` ("RENT" or "SELL")
- `price` (Float, for sale) / `rentalRate` (Float, for rent)
- `rentalPeriod` ("daily" or "monthly")
- `securityDeposit` (Float, refundable)
- `condition` ("Like New", "Good", "Fair")
- `images` (JSON array of URLs)
- `sellerId` (Ref to User)
- `isAvailable` (Boolean)
- `location` (Dorm/Campus spot)
- `viewsCount` (Int)

### 3. `RentalTransaction`
- `id` (String UUID)
- `itemId`, `buyerId`, `sellerId`
- `type` ("RENT" or "BUY")
- `startDate`, `endDate` (For rentals)
- `totalAmount`, `depositAmount`
- `status` ("PENDING", "ACTIVE", "COMPLETED", "CANCELLED")
- `paymentStatus` ("PAID", "REFUNDED")
- `pickupLocation`, `notes`

### 4. `Inquiry`
- `id`, `itemId`, `senderId`, `receiverId`, `message`, `createdAt`

---

## 🔑 Quick Demo Accounts (Password: `password123`)

| Name | Role | Email | University & Location |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | Senior Moving Out (Seller) | `alex@stanford.edu` | Stanford (Wilbur Hall) |
| **Emma Watson** | Junior Renter / Premed | `emma@stanford.edu` | Stanford (Roble Hall) |
| **Sarah Chen** | Senior Lender | `sarah@stanford.edu` | Stanford (Florence Moore Hall) |
| **Marcus Vance** | Senior / Alum | `marcus@stanford.edu` | Stanford (Rains Houses) |

*(You can also use the **"1-Click Demo Login"** button on the top-right navbar to switch between accounts instantly without typing passwords!)*

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migrations & Seed
```bash
npx prisma db push
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm start
```
