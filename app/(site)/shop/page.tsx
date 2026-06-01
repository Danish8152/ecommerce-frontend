import { Suspense } from "react";
import ShopPageClient from "./ShopPageClient";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageClient />
    </Suspense>
  );
}
