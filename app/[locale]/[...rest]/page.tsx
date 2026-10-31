import { notFound } from "next/navigation";

// Unknown paths inside a language ("/en/nope") show that language's not-found page.
export default function CatchAll() {
  notFound();
}
