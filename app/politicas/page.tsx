'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Politicas from "@/components/pages/Politicas";

export default function PoliticasPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Politicas />
      </PageTransition>
    </AnimatePresence>
  );
}