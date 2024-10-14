"use client";
import { useState } from "react";
import Header from "./components/layout/header"
import Footer from "./components/layout/footer"

export default function Home() {
 
  return (
    <div className="p-8 max-w-xl mx-auto">
      <Header/>

      <Footer/>
    </div>
  );
}
