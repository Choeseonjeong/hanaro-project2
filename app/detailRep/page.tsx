"use client";
import { useState, useEffect } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { useRouter } from "next/navigation";

export default function DetailRep() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <Header />
      <div className="mt-8"></div>
      <Footer />
    </div>
  );
}
