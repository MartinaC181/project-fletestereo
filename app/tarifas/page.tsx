'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Tarifas from "@/src/pages/Tarifas";

export default function TarifasPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Tarifas />
      </PageTransition>
    </AnimatePresence>
  );
}