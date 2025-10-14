'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Nosotros from "@/src/pages/Nosotros";

export default function NosotrosPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Nosotros />
      </PageTransition>
    </AnimatePresence>
  );
}