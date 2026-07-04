# RentEase

RentEase is a modern, responsive rental marketplace built with React 19, TypeScript, Vite, Tailwind CSS v4, and shadcn/ui. This repository contains the frontend application, which demonstrates a complete user journey from browsing products to cart, checkout, vendor management, and admin oversight.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Folder Structure

- `src/components/` - Reusable UI components (shadcn/ui, layout elements, auth guards).
- `src/context/` - Application state management (`AppContext.tsx`).
- `src/data/` - Mock initial state and sample data.
- `src/hooks/` - Custom React hooks.
- `src/pages/` - Route components, grouped by domain (`admin/`, `user/`, `vendor/`).
- `src/router/` - React Router configuration.
- `src/types/` - TypeScript interface definitions.

## Known Limitations (Mocked Functionality)

This current build is focused on frontend architecture and UI/UX. The following systems are **mocked** via `localStorage` and `AppContext`, pending real backend integration:
- **Authentication**: Roles and user sessions are stored locally.
- **Payments**: The checkout process simulates an order without connecting to a real payment gateway (e.g., Stripe). Do not enter real credit card numbers.
- **Data Persistence**: All created orders, products, and vendor requests live in your browser's local storage.
- **File Uploads**: Image uploads are handled using base64 data URLs rather than a real object storage provider (like AWS S3 or Cloudinary).
- **Emails/Notifications**: Notifications are displayed in the UI but no real emails or SMS messages are sent.

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
