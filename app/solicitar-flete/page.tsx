'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import SolicitarFlete from "@/components/pages/SolicitarFlete";

export default function SolicitarFletePage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <SolicitarFlete />
      </PageTransition>
    </AnimatePresence>
  );
}