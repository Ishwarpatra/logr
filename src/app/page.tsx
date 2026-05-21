import type { Metadata } from "next";
import { Landing } from "@/components/marketing/Landing";

export const metadata: Metadata = {
  title: "logr — the story a resume can't tell",
  description:
    "A resume, LinkedIn, or bio can't tell your whole story — or speak to the agents now reading on someone's behalf. Log every event once: a timeline humans read and an llm.txt any agent can ingest.",
};

export default function Home() {
  return <Landing />;
}
