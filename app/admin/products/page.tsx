import { Suspense } from "react";
import AdminProductsClient from "./AdminProductsClient";

export default function AdminProducts() {
  return (
    <Suspense fallback={null}>
      <AdminProductsClient />
    </Suspense>
  );
}
