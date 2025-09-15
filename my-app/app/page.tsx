import Image from "next/image";
import { Hero } from "@/components/Hero"
import { Features, type Feature } from "@/components/Features";
import { FAQ } from "@/components/FAQ";

const FEATURES: Feature[] = [
  { title: "ゼロ環境構築", desc: "Dev Containerで“動く”状態からスタート" },
  { title: "実用LPを実装", desc: "フォーム＋管理ミニ画面まで" },
  { title: "TS基礎を実戦で", desc: "型・zod・Server Actionsの導入" },
];

export default function Home() {
  return (
    <div className="min-h-screen px-8 sm:px-20 py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <Image className="mx-auto dark:invert" src="/icons/next.svg" alt="Next.js" width={120} height={120}></Image>
        <Hero title="My Appへようこそ！" sub="Next.js + TypeScript を Codespaces で学ぼう" />
        <Features items={FEATURES} />
        <FAQ />
      </div>
    </div>
  );
}
