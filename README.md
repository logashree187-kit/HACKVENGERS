# 🔍 LostFound+ — Smart Campus Property Recovery Platform

[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React + Vite](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=flat&logo=react&logoColor=black)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **LostFound+** is an intelligent, cloud-backed Lost and Found ecosystem built for university campuses. It replaces chaotic social media groups and unmonitored inquiry desks with deterministic 100-point item matching, blind verification claims, role-based custody authorization, and MongoDB aggregation analytics.

---

## 📌 Problem & Solution

| Traditional Campus Lost & Found ❌ | LostFound+ Platform ✅ |
| :--- | :--- |
| Fragmented WhatsApp / Telegram channels and bulletin boards | **Centralized Discovery Hub** with instant multi-criteria filtering |
| Manual scanning of hundreds of photo posts | **100-Point Deterministic Match Engine** scoring opposing items |
| Anyone can falsely claim an item without verification | **Blind Proof Claim Verification** protecting private item details |
| No custody management; anyone can pick up property | **Campus Security Authority Mode (RBAC)** gating physical handover |
| Zero operational visibility into campus theft/loss trends | **Aggregation Dashboard** identifying loss hotspots & recovery KPIs |

---

## ⚡ Key Features

### 1. 🎯 100-Point Deterministic Smart Match Engine
Instead of black-box AI that hallucinate, LostFound+ employs a transparent, multi-signal scoring algorithm comparing newly reported items against opposite records (`Lost` vs `Found`):

| Criteria | Scoring Weight | Evaluation Logic |
| :--- | :---: | :--- |
| **Category Match** | **30 pts** | Exact category alignment (e.g., Electronics to Electronics) |
| **Location Proximity** | **30 pts** | Case-insensitive venue/room substring matching |
| **Color Similarity** | **20 pts** | Dominant color equality verification |
| **Keyword Overlap** | **10 pts** | Tokenized word overlap (>3 chars) across titles & descriptions |
| **Date Proximity** | **10 pts** | Loss/discovery dates within a 7-day proximity window |

*Matches are dynamically surfaced on the item details page with a circular progress gauge and human-readable reason badges.*

---

### 2. 🛡️ Two-Tier Role-Based Security (RBAC)
* **Student Mode (Default):**
  * Report lost or found belongings.
  * Browse the catalog and filter by status, category, and venue.
  * Submit ownership proof (secret identifying marks, serials, wallpapers).
  * View claim queue in **read-only** mode (*"Awaiting Security Desk Review"*).
* **Authority Mode (Campus Security Desk):**
  * Unlocked via the secure **Officer Login** in the top navigation bar.
  * Accesses claimant verification messages.
  * Authorizes returns (**Approve / Hand Over**) or rejects fraudulent requests (**Reject / Re-open**).

---

### 3. 📊 MongoDB Native Aggregation Analytics
Campus administrators gain real-time operational insights powered directly by MongoDB Atlas native aggregation pipelines:
* **KPI Metrics:** Live counts of Total Tracked, Missing, Found, Returned, and Pending Claims.
* **Category Breakdown Bar Chart:** Evaluates highest-frequency lost categories using `$group` and `$sort`.
* **Status Distribution Donut:** Visualizes lifecycle throughput (Open vs. Claimed vs. Returned).
* **Campus Incident Hotspots:** Identifies high-risk zones across the university (e.g., *Central Library*, *Cafeteria*, *Sports Complex*).

---

## 🏗️ Technical Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    REACT + VITE FRONTEND                    │
│   (Tailwind CSS v4, Lucide Icons, Recharts, Axios, Router)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API Calls
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 NODE.JS + EXPRESS BACKEND                   │
│   ├── Item Controller        (CRUD, status transitions)     │
│   ├── Match Controller       (100-point deterministic engine)│
│   ├── Claim Controller       (Lifecycle & verification)     │
│   └── Dashboard Controller   (Native MongoDB Aggregations)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM (Google DNS patched)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS CLUSTER                    │
│   ├── items       (title, type, category, location, status) │
│   ├── claims      (itemId, claimantId, message, status)     │
│   └── users       (name, email, role)                       │
└─────────────────────────────────────────────────────────────┘
📂 Project Structure
code
Text
lostfound-plus/
├── src/                          # Root React + Vite Frontend
│   ├── api/
│   │   └── index.js              # Centralized Axios client & response unwrappers
│   ├── components/
│   │   ├── EmptyState.jsx        # Empty state component
│   │   ├── ItemCard.jsx          # Feed listing card
│   │   ├── Loading.jsx           # Animated loading skeletons
│   │   ├── MatchCard.jsx         # Smart match score indicator & breakdown
│   │   ├── Navbar.jsx            # Header with Officer PIN modal
│   │   ├── SearchFilters.jsx     # Multi-criteria discovery controls
│   │   ├── StatCard.jsx          # Dashboard KPI counter widget
│   │   └── StatusBadge.jsx       # Status and item type badges
│   ├── pages/
│   │   ├── Admin.jsx             # Analytics dashboard (Recharts)
│   │   ├── Browse.jsx            # Discoverable feed with instant filters
│   │   ├── Claims.jsx            # Role-gated verification queue
│   │   ├── Details.jsx           # Spec inspection & matching panel
│   │   ├── Home.jsx              # Landing page with hero & recent items
│   │   └── Report.jsx            # Multi-attribute item reporting form
│   ├── App.jsx                   # Application routes
│   └── index.css                 # Styling tokens & Tailwind directives
│
├── server/                       # Node.js + Express Backend
│   ├── controllers/              # Business logic & match algorithms
│   ├── models/                   # Mongoose schemas (Item, Claim, User)
│   ├── routes/                   # REST API routes
│   ├── server.js                 # App entry point with SRV DNS resolver fix
│   └── package.json
│
├── .gitignore
├── package.json                  # Root dependencies
└── vite.config.js
🔌 API Reference
Health
GET /api/health — Check server connectivity.
Items (/api/items)
GET /api/items — Fetch all reported items sorted by date (createdAt: -1).
GET /api/items/:id — Fetch single item details.
POST /api/items — Publish a new lost/found item (default: status: 'Open').
PUT /api/items/:id — Update details or status.
Smart Matching (/api/matches)
GET /api/matches/:itemId — Computes 100-point deterministic match against opposing items.
Claims (/api/claims)
POST /api/claims — Submit an ownership claim (automatically locks item to status: 'Claimed').
GET /api/claims — Retrieve all claims with populated item references.
PUT /api/claims/:id — Authorize claim:
If Approved → item status automatically set to Returned.
If Rejected → item status automatically reverts to Open.
Dashboard (/api/dashboard)
GET /api/dashboard — Runs native MongoDB aggregations for KPIs, categories, statuses, and location hotspots.
🚀 Getting Started
Prerequisites
Node.js (v18 or later)
Git
A MongoDB Atlas cluster connection string
1. Clone the Repository
code
Bash
git clone https://github.com/logashree187-kit/HACKVENGERS.git
cd HACKVENGERS
2. Backend Setup
Navigate into the server directory:
code
Bash
cd server
npm install
Create a .env file inside server/:
code
Env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
Start the backend server:
code
Bash
node server.js
The server will run on http://localhost:5000 with MongoDB Atlas connected.
3. Frontend Setup
Open a new terminal tab at the project root:
code
Bash
npm install
Start the Vite development server:
code
Bash
npm run dev
Open your browser and navigate to:
code
Text
http://localhost:5173
🔑 Demo Credentials (Authority Mode)
To test administrative claims resolution:
Click Officer Login in the navigation bar.
Enter the passkey: admin123
Click Unlock Authority View to enable Approve and Reject buttons on /claims.
👥 Team HACKVENGERS
Built for the MongoDB Innovation Hackathon.
Dedicated to making campus life safer, organized, and connected through intelligent software.