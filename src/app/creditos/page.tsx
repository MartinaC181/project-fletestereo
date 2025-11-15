'use client'

import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "@/src/components/PageTransition";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Code2, Github, Linkedin, Mail, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const teamMembers = [
  {
    name: "Máximo Masdeu",
    role: "Full Stack Developer",
    description: "Estudiante de Tecnicatura Universitaria en Programación en la UTN Resistencia, Chaco. Enfoque en desarrollo frontend con conocimientos en backend.",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    githubUsername: "maximomasdeu",
    github: "https://github.com/maximomasdeu",
    linkedin: "https://www.linkedin.com/in/maximo-masdeu-8b4a5b2a4/",
    email: "masdeu398@gmail.com",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Esteban Cardozo",
    role: "Backend Developer",
    description: "Estudiante de Tecnicatura Universitaria en Programación en la UTN Resistencia, Chaco. Especializado en desarrollo backend y bases de datos.",
    skills: ["Supabase", "PostgreSQL", "API Design", "Cloud"],
    githubUsername: "estebancardoz0",
    github: "https://github.com/estebancardoz0",
    linkedin: "https://www.linkedin.com/in/esteban-cardozo19/",
    email: "esteban.cardozo.wec@gmail.com",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Martina Canteros",
    role: "Frontend Developer",
    description: "Estudiante de Tecnicatura Universitaria en Programación en la UTN Resistencia, Chaco. Enfoque en desarrollo backend con conocimientos en frontend.",
    skills: ["UI/UX", "Tailwind CSS", "Animations", "Responsive Design"],
    githubUsername: "MartinaC181",
    github: "https://github.com/MartinaC181",
    linkedin: "https://ar.linkedin.com/in/martina-abigail-canteros",
    email: "martiinacanteros@gmail.com",
    color: "from-amber-500 to-orange-500"
  }
];

export default function CreditosPage() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Code2 className="h-8 w-8 text-accent-yellow" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-yellow via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Coderrientes
                </h1>
                <Sparkles className="h-8 w-8 text-accent-yellow" />
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                El equipo apasionado detrás de <span className="font-semibold text-accent-yellow">Fletestereo</span>
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <span>Hecho con</span>
                <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
                <span>en Corrientes, Argentina</span>
              </div>
            </motion.div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-accent-yellow overflow-hidden group">
                    {/* Gradient Header */}
                    <div className={`h-32 bg-gradient-to-br ${member.color} relative`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                        <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-gray-800 relative group-hover:scale-105 transition-transform">
                          <Image
                            src={`https://github.com/${member.githubUsername}.png`}
                            alt={`${member.name} - GitHub Profile`}
                            width={96}
                            height={96}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>

                    <CardContent className="pt-16 pb-6 px-6 text-center">
                      {/* Name & Role */}
                      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        {member.description}
                      </p>

                      {/* Social Links */}
                      <div className="flex justify-center gap-3">
                        <Link
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-accent-yellow/20 hover:text-accent-yellow transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                        <Link
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-accent-yellow/20 hover:text-accent-yellow transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Link>
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-full bg-muted hover:bg-accent-yellow/20 hover:text-accent-yellow transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tech Stack Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-accent-yellow/20 bg-gradient-to-br from-background to-accent-yellow/5">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent-yellow" />
                    Tecnologías Utilizadas
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Este proyecto fue desarrollado con tecnologías modernas y herramientas de vanguardia
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      "Next.js 14",
                      "React 18",
                      "TypeScript",
                      "Tailwind CSS",
                      "Supabase",
                      "PostgreSQL",
                      "Framer Motion",
                      "Google Maps API",
                      "shadcn/ui"
                    ].map((tech) => (
                      <Badge 
                        key={tech}
                        variant="secondary"
                        className="text-sm px-4 py-2 bg-accent-yellow/10 hover:bg-accent-yellow/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center mt-16"
            >
              <p className="text-muted-foreground">
                ¿Tienes un proyecto en mente?{" "}
                <Link href="/contacto" className="text-accent-yellow hover:underline font-semibold">
                  Contáctanos
                </Link>
              </p>
            </motion.div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </AnimatePresence>
  );
}
