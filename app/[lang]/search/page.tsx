// app/[lang]/search/page.tsx
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/middleware";
import type { Metadata } from "next";
import SearchClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: dict.searchClasses?.meta?.title || "Search Classes",
    description: dict.searchClasses?.meta?.description || "Search for classes in your area",
  };
}

export default async function SearchPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  return <SearchClient params={{ lang }} dictionary={dictionary} />;
}