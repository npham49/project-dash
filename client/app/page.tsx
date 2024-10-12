import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const faqItems = [
    {
      question: "What is TaskFlow?",
      answer:
        "TaskFlow is a powerful task management solution designed to streamline your workflow and boost productivity. It offers intuitive boards, team collaboration features, and insightful analytics.",
    },
    {
      question: "How does TaskFlow compare to other task management tools?",
      answer:
        "TaskFlow stands out with its user-friendly interface, advanced collaboration features, and powerful analytics. It's designed to be flexible enough for personal use and scalable for large teams.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial.",
    },
    {
      question: "Can I integrate TaskFlow with other tools?",
      answer:
        "Absolutely! TaskFlow offers integrations with popular tools like Slack, Google Workspace, and Microsoft Teams. We're constantly adding new integrations to enhance your workflow.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent to-secondary">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <nav className="flex justify-between items-center mb-12">
          <Image src="/icon.png" alt="TaskFlow Logo" width={120} height={40} />
          <div className="space-x-4">
            <LoginLink>
              <Button variant="default">Login</Button>
            </LoginLink>
            <RegisterLink>
              <Button variant="secondary">Register</Button>
            </RegisterLink>
          </div>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Ideation Pipeline
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Trying to manage multiple projects and ideas? We've got you covered.
          </p>
          <RegisterLink>
            <Button variant="default">Get Started for Free</Button>
          </RegisterLink>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Intuitive Boards",
              description: "Organize tasks with drag-and-drop simplicity",
              icon: "📊",
            },
            {
              title: "Team Collaboration",
              description: "Work together seamlessly on projects",
              icon: "👥",
            },
            {
              title: "Powerful Analytics",
              description: "Gain insights to boost productivity",
              icon: "📈",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-md"
            >
              <div className="text-4xl mb-4" aria-hidden="true">
                {feature.icon}
              </div>
              <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-foreground"
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <footer className="bg-accent py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <p className="text-sm sm:text-base mb-2 sm:mb-0">
              &copy; 2023 TaskFlow. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm">
              TaskFlow™ is a registered trademark of TaskFlow Inc.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
