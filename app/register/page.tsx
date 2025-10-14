'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Register from "@/src/pages/Register";

export default function RegisterPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Register />
      </PageTransition>
    </AnimatePresence>
  );
}