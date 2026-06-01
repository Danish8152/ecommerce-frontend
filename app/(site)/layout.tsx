import { Suspense } from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
