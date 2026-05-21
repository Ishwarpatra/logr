import type { Metadata } from "next";
import { Landing } from "@/components/marketing/Landing";

export const metadata: Metadata = {
  title: "logr — log your life",
  description:
    "A personal life-log for humans and the machines they raise. One timeline, kept once — a readable page and an exportable llm.txt.",
};

export default function Home() {
  return <Landing />;
}
