# Rentease-
RentEase is a full-stack e-commerce platform for renting premium furniture and home appliances. Built with Node.js, Express, PostgreSQL, and Bootstrap 5, it features JWT authentication, flexible monthly rental plans, dynamic cart management, and a dedicated admin dashboard for real-time inventory and order tracking.
Key Features
User Experience
Secure Authentication Pipeline: Robust user registration and session management utilizing JSON Web Tokens (JWT) and bcrypt password hashing.

Dynamic Product Catalog: Real-time inventory browsing fetching up-to-date furniture and appliance data directly from the PostgreSQL database.

Variable Rental Tenures: Customizable rental plans (e.g., 3, 6, or 12 months) featuring dynamically calculated pricing tiers and automated security deposit assessments.

Frictionless Checkout Flow: Persistent cart management, detailed order summaries, and a streamlined, multi-step checkout process.

Order Lifecycle Management: Comprehensive post-purchase tracking, from initial order confirmation to active rental history.

Administrative Dashboard
Inventory Management System (IMS): An intuitive visual interface to seamlessly create, read, update, and delete (CRUD) product listings and stock levels.

Real-Time Order Monitoring: Track incoming customer orders, review detailed buyer information, and transition delivery statuses (Pending -> Active -> Delivered).

Operational Analytics: A quick-glance data dashboard providing insights into total revenue, active rental volume, and user acquisition metrics.

Tech Stack & Architecture
Frontend (Client-Side)

Core: HTML5, CSS3, Vanilla JavaScript

UI Framework: Bootstrap 5 (Responsive, mobile-first design adapted from the Furni template)

Integration: Fetch API for asynchronous backend communication

Backend (Server-Side)

Runtime & Framework: Node.js paired with Express.js for scalable, RESTful API architecture

Database: PostgreSQL for robust relational data management

ORM: Prisma for type-safe database queries, schema migrations, and relational mapping

Security & Configuration: JWT for stateless authentication and dotenv for environment variable isolation

Database Schema Overview
The platform relies on a normalized relational database model designed for scalability and data integrity:

Users: Securely stores customer profiles, authentication hashes, and role-based access levels (User/Admin).

Products: The central inventory ledger managing descriptions, pricing, stock availability, and image assets.

Rental Plans: A relational mapping table that ties flexible tenure durations and specific pricing tiers to individual products.

Cart & Cart Items: Manages temporary, active shopping sessions prior to checkout conversion.

Orders & Order Items: The historical ledger of all finalized transactions, calculating aggregated totals and tracking fulfillment states.
