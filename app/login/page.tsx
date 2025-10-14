'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Login from "@/components/pages/Login";

export default function LoginPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Login />
      </PageTransition>
    </AnimatePresence>
  );
}