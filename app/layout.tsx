import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "امواتگرام",
  description: "سامانه ثبت آگهی درگذشت مراسم و صفحه یادبود",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>){
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}