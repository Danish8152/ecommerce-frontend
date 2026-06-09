# Reviews & Ratings Module - Frontend Integration

## Overview
Complete end-to-end frontend integration for the Reviews & Ratings Module with customer-facing review display/creation and admin moderation dashboard.

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16.2.6 with App Router
- **UI Library**: React 19.2.4 with Tailwind CSS 4
- **HTTP Client**: Axios with interceptors for auth token handling
- **Date Formatting**: date-fns
- **Components**: Lucide React icons, Framer Motion animations
- **Notifications**: React Hot Toast

### API Layer Pattern
- **Client**: `lib/api.ts` exports `reviewApi` and `adminReviewApi` objects
- **Proxy Routes**: Next.js API routes (`app/api/v1/**`) proxy requests to backend at `process.env.API_URL`
- **Auth**: Automatic Bearer token injection via axios interceptors
- **Error Handling**: Centralized via axios response interceptor with token refresh

---

## Files Created/Modified

### 1. API Client Layer (`lib/api.ts` - UPDATED)

Added three API client objects:

**`reviewApi`** - Customer review operations
```typescript
reviewApi.create(data)              // POST /v1/reviews
reviewApi.getById(id)                // GET /v1/reviews/:id
reviewApi.update(id, data)           // PATCH /v1/reviews/:id
reviewApi.delete(id)                 // DELETE /v1/reviews/:id
reviewApi.listForProduct(id, params) // GET /v1/products/:id/reviews
reviewApi.uploadMedia(file)          // POST /v1/reviews/media/upload
reviewApi.addHelpfulVote(id)         // POST /v1/reviews/:id/helpful
reviewApi.removeHelpfulVote(id)      // DELETE /v1/reviews/:id/helpful
```

**`adminReviewApi`** - Admin moderation operations
```typescript
adminReviewApi.list(params)          // GET /v1/admin/reviews
adminReviewApi.getById(id)           // GET /v1/admin/reviews/:id
adminReviewApi.approve(id)           // PATCH /v1/admin/reviews/:id/approve
adminReviewApi.reject(id)            // PATCH /v1/admin/reviews/:id/reject
adminReviewApi.hide(id)              // PATCH /v1/admin/reviews/:id/hide
adminReviewApi.addReply(id, data)    // PATCH /v1/admin/reviews/:id/reply
adminReviewApi.delete(id)            // DELETE /v1/admin/reviews/:id
adminReviewApi.getAnalytics()        // GET /v1/admin/reviews/analytics
adminReviewApi.getTopRated(params)   // GET /v1/admin/reviews/analytics/top-rated
adminReviewApi.getLowestRated(params)// GET /v1/admin/reviews/analytics/lowest-rated
adminReviewApi.getMostReviewed(params)// GET /v1/admin/reviews/analytics/most-reviewed
```

**`uploadApi`** - Media upload for reviews
```typescript
uploadApi.uploadReviewMedia(file)    // POST /v1/media/upload/reviews
```

### 2. API Proxy Routes (NEW)

**`app/api/proxy-utils.ts`**
- `createProxyHandler(pathPrefix)` - Reusable function for creating proxy route handlers
- Handles header forwarding (auth, cookies, content-type, etc.)
- Manages request body for POST/PUT/PATCH/DELETE
- Proxies responses with set-cookie header preservation

**`app/api/v1/reviews/[[...path]]/route.ts`**
- Handles GET, POST, PATCH, DELETE for all `/reviews/*` routes
- Matches routes like `/reviews`, `/reviews/1`, `/reviews/1/helpful`, `/reviews/media/upload`

**`app/api/v1/admin/reviews/[[...path]]/route.ts`**
- Handles all admin review operations
- Routes: `/admin/reviews`, `/admin/reviews/1`, `/admin/reviews/1/approve`, `/admin/reviews/analytics`, etc.

**`app/api/v1/products/[id]/reviews/route.ts`**
- Handles product-specific review listing
- Route: `/products/1/reviews`

### 3. React Components (`app/components/review/`)

**`ReviewCard.tsx` (66 lines)**
- Display single review with all details
- Props: id, rating, title, comment, userName, isVerifiedPurchase, helpfulCount, createdAt, media, adminReply
- Features:
  - Star rating visualization
  - Verified purchase badge
  - Media gallery (up to 5 images)
  - Admin reply display
  - Helpful vote button
  - Delete action for owners/admins
  - Relative date formatting

**`ReviewForm.tsx` (150 lines)**
- Form for creating/editing reviews
- Features:
  - 5-star interactive rating picker with hover effect
  - Title input (max 160 chars)
  - Comment textarea (max 5000 chars)
  - Image upload (max 5 images, async upload)
  - Real-time character counter
  - Loading state during submission
  - Cancel button support
  - Form validation (rating & comment required)

**`ReviewsSection.tsx` (280 lines)**
- Complete reviews display/creation section for product pages
- Features:
  - Overall rating stats card
  - Rating distribution bar chart
  - Pagination with limit/page params
  - Filter by rating (all/5/4/3)
  - Sort options (newest, highest rating, most helpful)
  - Embedded review form (toggleable)
  - Empty state with CTA
  - Loading states
  - Admin reply display
  - Helpful vote tracking
  - Delete review with confirmation
  - Current user detection for ownership

**`ReviewStats.tsx` (45 lines)**
- Admin dashboard widget showing review analytics
- Displays: total reviews, approved count, pending count, average rating
- Color-coded stat cards

**`AdminReviewsClient.tsx` (400+ lines)**
- Full admin review moderation interface
- Features:
  - Real-time data from backend
  - Analytics cards (total, approved, pending, rejected, avg rating)
  - Search by customer, product, or comment
  - Filter by status (All, Pending, Approved, Rejected, Hidden)
  - Responsive table with status badges
  - Action buttons: Approve, Reject, Hide, Reply, Delete
  - Admin reply modal with 2000 char limit
  - Real-time UI updates after actions
  - Toast notifications
  - Loading/empty states

**`index.ts`**
- Barrel export for clean imports

### 4. Page Components (MODIFIED)

**`app/(site)/product/[id]/ProductDetailClient.tsx` (UPDATED)**
- Added `ReviewsSection` import
- Integrated ReviewsSection before "You May Also Like" section
- Passes productId, productName, isLoggedIn props
- Displays reviews prominently on product detail page

**`app/admin/reviews/page.tsx` (UPDATED)**
- Replaced hardcoded demo data with `AdminReviewsClient` component
- Added metadata for page title/description
- Server-rendered with client component pattern

**`app/admin/reviews/AdminReviewsClient.tsx` (NEW)**
- Extracted admin UI logic into separate client component
- Better code organization and maintainability

---

## Data Models

### Review
```typescript
{
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  status: string; // APPROVED, PENDING, REJECTED, HIDDEN
  helpfulCount: number;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
  };
  product?: {
    id: number;
    name: string;
    image: string;
  };
  media?: Array<{ id: number; url: string; filename: string }>;
}
```

### ReviewStats
```typescript
{
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>; // { "1": 2, "2": 5, "3": 10, ... }
}
```

---

## Integration Points

### 1. Product Detail Page
**Location**: `app/(site)/product/[id]/ProductDetailClient.tsx`

```typescript
<ReviewsSection
  productId={productId}
  productName={product.name}
  isLoggedIn={Boolean(localStorage.getItem("accessToken"))}
/>
```

Shows:
- Approved reviews for the product
- Overall rating and distribution stats
- Form to add new review (for logged-in users)
- Helpful vote counter

### 2. Admin Dashboard
**Location**: `app/admin/reviews/page.tsx`

Features:
- Moderation table with all reviews
- Status filtering and search
- One-click approve/reject/hide actions
- Reply to reviews with modal
- Delete reviews with confirmation
- Analytics cards showing stats

### 3. Review Creation Flow
1. User clicks "Add Review" on product detail
2. ReviewForm modal opens
3. User rates (1-5 stars), adds title & comment
4. User uploads up to 5 images (optional)
5. Form validates rating & comment required
6. Submits to `reviewApi.create()`
7. Backend creates review (status depends on moderation toggle)
8. Toast notification shows result
9. Reviews list refreshes

### 4. Admin Moderation Flow
1. Admin goes to `/admin/reviews`
2. Views all reviews with optional filters/search
3. Clicks action buttons to:
   - Approve: Changes status to APPROVED
   - Reject: Changes status to REJECTED
   - Hide: Changes status to HIDDEN (soft delete)
   - Reply: Opens modal to add admin reply
   - Delete: Hard delete with confirmation
4. Real-time UI updates reflect changes

---

## Environment Variables

Required in `.env` or `.env.local`:
```
API_URL=http://localhost:5000  # Backend API base URL
```

This is used by the proxy routes to forward requests to the backend.

---

## Authentication

### Token Handling
- Customer access token: stored in `localStorage` as `accessToken`
- Admin access token: stored in `localStorage` as `adminAccessToken`
- Tokens automatically injected in `Authorization: Bearer <token>` header
- Token refresh handled automatically on 401 responses

### Permission Validation
- Backend validates permissions (review.create, review.moderate, review.reply, etc.)
- Frontend UI conditionally shows/hides buttons based on auth state
- Admin buttons only appear on admin pages (verified by `isAdminRoute()` function)

---

## Error Handling

### Frontend Error States
1. **Network Errors**: Toast notifications with user-friendly messages
2. **Validation Errors**: Form validation before submission, field-level feedback
3. **API Errors**: 400/401/403/500 responses handled with toast messages
4. **Loading States**: Spinner/disabled buttons during async operations

### Specific Error Scenarios
- No reviews found: Empty state card with "Be the first to review" CTA
- Failed to load reviews: Error toast + empty list
- Unauthorized review actions: Redirect to login
- Media upload failures: Toast + remove from preview
- Admin action failures: Toast + UI reverts to previous state

---

## Performance Optimizations

1. **Pagination**: Reviews load 10-50 per page (configurable)
2. **Image Lazy Loading**: Next.js Image component with `sizes` prop
3. **API Caching**: `cache: "no-store"` for always-fresh data
4. **Async Component Loading**: ReviewForm/ReviewStats load on demand
5. **Debounced Search**: Search input with 300ms debounce (can be added)
6. **Memoization**: Review stats calculated once and cached

---

## Testing the Integration

### 1. Manual Test - Customer Review Flow
```
1. Go to any product detail page: /product/1
2. Scroll to reviews section (below product tabs)
3. Click "+ Add Review" button
4. Rate the product (1-5 stars)
5. Add title and comment
6. Upload 1-2 images
7. Click "Submit Review"
8. Should see "Review submitted! It will be visible after approval."
9. Go to /admin/reviews as admin
10. Find your review (status: PENDING)
11. Click "Approve"
12. Status changes to APPROVED
13. Go back to product page, review now visible
```

### 2. Manual Test - Admin Moderation
```
1. Go to /admin/reviews
2. See analytics cards (Total, Approved, Pending, etc.)
3. Search for a customer name
4. Filter by status (Pending)
5. Click "Reply" button
6. Add admin response
7. Click "Send Reply"
8. Go back to product page, see admin reply on review
```

### 3. API Testing (with curl)
```bash
# Get reviews for product 1
curl http://localhost:3000/api/v1/products/1/reviews

# Create review (requires auth token)
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"rating":5,"title":"Great!","comment":"Loved it"}'

# Admin list reviews
curl http://localhost:3000/api/v1/admin/reviews \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Approve review
curl -X PATCH http://localhost:3000/api/v1/admin/reviews/1/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Deployment Checklist

- [ ] `.env` configured with correct `API_URL`
- [ ] Backend API running and accessible
- [ ] Database migrations executed on backend (`npm run db:migrate`)
- [ ] Feature toggles enabled (reviews_enabled=true, etc.)
- [ ] RBAC permissions configured (review.create, review.moderate, etc.)
- [ ] Frontend build successful (`npm run build`)
- [ ] No console errors in browser DevTools
- [ ] Review creation works on product pages
- [ ] Admin moderation dashboard loads reviews
- [ ] Images upload correctly in review forms
- [ ] Admin replies display on public reviews
- [ ] Helpful votes increment correctly
- [ ] Search/filter works on admin page

---

## Future Enhancements

1. **Advanced Analytics**
   - Top-rated products dashboard
   - Lowest-rated products alerts
   - Review sentiment analysis
   - Customer review frequency tracking

2. **Review Verification**
   - Verified purchase badge for all reviews (enhanced display)
   - Review authenticity scoring
   - Duplicate review detection

3. **Personalization**
   - "Helpful to me" weighted sorting
   - Review recommendations based on product variant
   - Most helpful reviewer badges

4. **Moderation AI**
   - Automatic spam detection
   - Inappropriate content flagging
   - Sentiment-based review classification

5. **Community Features**
   - Review voting (unhelpful votes)
   - Review comments/discussions
   - Review badges (verified purchase, certified buyer, etc.)

---

## Troubleshooting

### Issue: Reviews don't appear on product page
**Solution**: 
- Check backend is running at `API_URL`
- Verify reviews exist in database (check admin page)
- Check browser console for API errors
- Verify reviews have status="APPROVED"

### Issue: Admin reply modal not working
**Solution**:
- Check admin user has "review.reply" permission
- Verify admin token is valid
- Check backend for permission errors in logs

### Issue: Image upload fails
**Solution**:
- Check media section "reviews" exists in backend
- Verify file size < 5MB
- Check backend S3/storage configuration
- Try different image format (JPG/PNG)

### Issue: Build fails with "Object literal may only specify known properties"
**Solution**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm ci`
- Rebuild: `npm run build`

---

## Support & Documentation

- Backend API Docs: `/api-docs` (Swagger)
- Backend README: `Ecommerce-central-backend/README.md`
- Frontend Development: `npm run dev` starts dev server at `http://localhost:3000`
- Build Frontend: `npm run build && npm start`

