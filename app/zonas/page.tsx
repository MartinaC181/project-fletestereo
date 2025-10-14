'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Zonas from "@/components/pages/Zonas";

export default function ZonasPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Zonas />
      </PageTransition>
    </AnimatePresence>
  );
}