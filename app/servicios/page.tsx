'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Servicios from "@/components/pages/Servicios";

export default function ServiciosPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Servicios />
      </PageTransition>
    </AnimatePresence>
  );
}