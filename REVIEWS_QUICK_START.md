# Reviews Module - Quick Start Guide

## What Was Built

A complete, production-grade Reviews & Ratings module for the ecommerce frontend with:
- **Customer-facing**: View reviews, create reviews, upload review images, vote helpful
- **Admin-facing**: Moderate reviews, approve/reject/hide, reply to reviews, view analytics

---

## Quick Setup

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Ensure .env has backend URL
echo "API_URL=http://localhost:5000" > .env.local
```

### 2. Start Development Server
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend must be running at http://localhost:5000
```

### 3. Test the Module

#### Customer Side:
1. Go to `/product/1` (any product)
2. Scroll down to "Customer Reviews" section
3. Click "+ Add Review"
4. Fill form: rate (1-5★), title, comment
5. Upload 1-2 images (optional)
6. Submit

#### Admin Side:
1. Go to `/admin/reviews`
2. See pending reviews
3. Click "Approve" to publish
4. Click "Reply" to add store response
5. Review now shows on product page with admin reply

---

## File Structure

```
app/
├── components/review/              # All review components
│   ├── ReviewCard.tsx              # Single review display
│   ├── ReviewForm.tsx              # Create/edit review form
│   ├── ReviewsSection.tsx          # Product page review section
│   ├── ReviewStats.tsx             # Admin stats widget
│   ├── AdminReviewsClient.tsx      # Admin moderation page
│   └── index.ts                    # Barrel exports
├── api/v1/
│   ├── proxy-utils.ts              # Shared proxy handler
│   ├── reviews/[[...path]]/        # Review API routes
│   ├── admin/reviews/[[...path]]/  # Admin API routes
│   └── products/[id]/reviews/      # Product reviews endpoint
├── admin/reviews/
│   ├── page.tsx                    # Admin page (server)
│   └── AdminReviewsClient.tsx      # Admin page (client)
└── (site)/product/[id]/
    └── ProductDetailClient.tsx     # Product page with reviews
lib/
└── api.ts                          # API client (reviewApi, adminReviewApi)
```

---

## Key APIs

### Customer Operations
```typescript
import { reviewApi } from '@/lib/api';

// Create review
await reviewApi.create({
  productId: 1,
  rating: 5,
  title: "Great product!",
  comment: "Highly recommend",
  mediaIds: [123, 124]
});

// List reviews for product
await reviewApi.listForProduct(1, { page: 1, limit: 10 });

// Add helpful vote
await reviewApi.addHelpfulVote(reviewId);
```

### Admin Operations
```typescript
import { adminReviewApi } from '@/lib/api';

// Get all reviews
await adminReviewApi.list({ status: 'PENDING', page: 1 });

// Approve review
await adminReviewApi.approve(reviewId);

// Add reply
await adminReviewApi.addReply(reviewId, { reply: "Thank you!" });

// Get analytics
await adminReviewApi.getAnalytics();
```

---

## Component Usage

### ReviewsSection (Product Page)
```tsx
import { ReviewsSection } from '@/app/components/review';

<ReviewsSection
  productId={productId}
  productName={productName}
  isLoggedIn={true}
/>
```

### ReviewStats (Admin Dashboard)
```tsx
import { ReviewStats } from '@/app/components/review';

<ReviewStats />
```

---

## Authentication

- **Customer**: Login at `/login`, stored in `localStorage.accessToken`
- **Admin**: Login at `/admin/login`, stored in `localStorage.adminAccessToken`
- Tokens automatically added to all API requests
- Token refresh handled automatically on 401

---

## Common Tasks

### Hide a Review (Soft Delete)
```typescript
await adminReviewApi.hide(reviewId);
// Review still in database but not public
```

### Get Top-Rated Products
```typescript
const data = await adminReviewApi.getTopRated({ limit: 10 });
// Returns products sorted by avg rating
```

### Filter Reviews by Status
```typescript
await adminReviewApi.list({
  status: 'PENDING',  // APPROVED, REJECTED, HIDDEN
  rating: 5,          // 1-5
  page: 1,
  limit: 50
});
```

### Upload Review Images
```typescript
const response = await reviewApi.uploadMedia(file);
// Returns { id, url, filename, ... }
// Then pass id in reviewApi.create() mediaIds array
```

---

## Troubleshooting

### "API_URL not configured"
- Add `API_URL=http://localhost:5000` to `.env.local`
- Restart dev server: `npm run dev`

### Reviews not showing on product page
- Check backend running: `curl http://localhost:5000/health`
- Check reviews exist: Go to `/admin/reviews`
- Check review status: Must be `APPROVED` to show publicly

### Can't create review
- Verify logged in: Check `localStorage.accessToken`
- Check permission: Backend validates `review.create` permission
- Check feature toggle: `reviews_enabled` must be true

### Admin reply not saving
- Verify admin login: Check `localStorage.adminAccessToken`
- Check permission: Must have `review.reply` permission
- Check character limit: Max 2000 chars

---

## Build & Deploy

```bash
# Production build
npm run build

# Test build locally
npm start

# Deploy (e.g., Vercel)
# Push to git, auto-deploy or use vercel CLI
```

Environment variables needed on production:
```
API_URL=https://api.example.com
```

---

## Support

For detailed info see:
- `REVIEW_INTEGRATION.md` - Complete architecture & integration guide
- Backend docs: `../Ecommerce-central-backend/REVIEW_IMPLEMENTATION.md`
- Swagger API docs: `http://localhost:5000/api-docs`

---

## What's Next?

Optional enhancements:
- [ ] Add review photos gallery view
- [ ] Email notifications for admin replies
- [ ] Review sorting by "Most Helpful"
- [ ] Moderation filters (spam detection)
- [ ] Customer review history on profile page
- [ ] Bulk moderation actions

