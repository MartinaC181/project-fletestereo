'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Index from "@/src/pages/Index";

export default function HomePage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Index />
      </PageTransition>
    </AnimatePresence>
  );
}