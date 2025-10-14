'use client'

import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Contacto from "@/src/pages/Contacto";

export default function ContactoPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <Contacto />
      </PageTransition>
    </AnimatePresence>
  );
}