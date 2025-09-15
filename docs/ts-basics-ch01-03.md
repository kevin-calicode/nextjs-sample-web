# 3章までで身につけた TypeScript の詳細解説

> 対象：章01（セットアップ）、章02（アイコン内製化）、章03（UI分割）
> 実プロジェクト：Next.js (App Router)＋`components/` 分割

---

## 0. 前提とゴール

* **目的**：TypeScript を“実装しながら”体得する
* **本章までのねらい**：

  1. **Props の型付け**と **optional** を理解する
  2. **配列・オブジェクト**の型付け
  3. **型だけ import**（値と型の分離）
  4. **ナローイング**（条件分岐で型が狭まる）
  5. Next.js と TS の実用ポイント（`next/image` など）

---

## 1. Props 型の定義：`type Props = { … }`

### 例（`Hero.tsx`）

```tsx
// components/Hero.tsx
type Props = { title: string; sub?: string }; // ← sub は「省略可能」

export function Hero({ title, sub }: Props) {
  return (
    <section className="py-16 text-center">
      <h1 className="text-3xl sm:text-5xl font-bold">{title}</h1>
      {sub && <p className="mt-3 text-zinc-600 dark:text-zinc-400">{sub}</p>}
    </section>
  );
}
```

* **構造的型付け**：オブジェクトの「形」で一致を判定する（`title` が `string` なら OK）。
* **optional（`?`）**：`sub?: string` は `string | undefined` を意味する。渡さなくても型エラーにならない。
* `type` と `interface` の違い：どちらでも可。**本講座は `type` を基本**に（合成が直感的で、union 等と相性が良い）。

> ワンポイント：デフォルト値が欲しい時は**引数のデフォルト**で付けるのが簡単。

```tsx
export function Hero({ title, sub = "補足テキスト" }: Props) { ... }
```

---

## 2. 配列とオブジェクトの型：`Feature[]`

### 例（`Features.tsx`）

```tsx
// components/Features.tsx
export type Feature = { title: string; desc: string };

export function Features({ items }: { items: Feature[] }) {
  return (
    <section className="grid gap-6 sm:grid-cols-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold">{f.title}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
```

* **配列の型**は `T[]` か `Array<T>`。本講座は読みやすい `T[]` 派。
* **`map` 内の `f`** には **型推論**が効く（`Feature` として補完が出る）。
* `key={i}` は「順番が変わらない静的リスト」なら実務でも許容（厳密には一意キー推奨）。

---

## 3. 型だけ import：`import { type Feature } from ...`

### 例（`app/page.tsx`）

```tsx
import { Features, type Feature } from "@/components/Features";

const FEATURES: Feature[] = [
  { title: "ゼロ環境構築", desc: "Dev Containerで“動く”状態からスタート" },
  { title: "実用LPを実装", desc: "フォーム＋管理ミニ画面まで" },
  { title: "TS基礎を実戦で", desc: "型・zod・Server Actionsの導入" },
];
```

* **値と型を明確に分ける**宣言。
* **ビルド時に型が消える**ため、不要なランタイム import を避けられる（最適化 & バンドル健全）。
* ありがちなエラー：

  * *“Feature refers to a value, but is being used as a type”* → `type` を付けて解決。

---

## 4. ナローイング：条件分岐で型が狭まる

```tsx
{sub && <p>{sub}</p>}
```

* `sub?: string` は `string | undefined`。
* `sub &&` の時点で **Truthy** 判定 → **分岐内では `string` に“狭まる”**（＝補完/エラーが正しくなる）。
* 他にも `typeof v === 'string'`、`Array.isArray(v)` などで型を絞れる（**“ナローイング”**）。

---

## 5. 関数宣言 vs アロー関数

* **本講座の既定**：`export function Component(...) {}`

  * ジェネリックやオーバーロード時に書きやすい
  * 前方参照（同ファイルで先に使う）も安全
* **例外**：`forwardRef` / `memo` を使う時は `export const Comp = memo(...)` が書きやすい

> 速度差は実質なし。\*\*“ルールを決めて統一”\*\*が読みやすさに直結。

---

## 6. パスエイリアス：`@/*`

`tsconfig.json`（Create Next App の既定で構成済みの場合が多い）

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

* `@/components/Hero` のように **絶対パスで import** できる。
* **フォルダ移動に強い**（相対パス地獄を回避）。

---

## 7. Next.js の型付きコンポーネント（`next/image`）

```tsx
<Image
  className="mx-auto dark:invert"
  src="/icons/next.svg"
  alt="Next.js"
  width={120}
  height={120}
/>
```

* `alt: string`／`width,height: number` は **必須**（TS がガイド）。
* `priority` は **初回表示の主画像**にだけ（SVGロゴには通常不要）。
* **外部 SVG** を `<Image>` で参照しても **親の `color` は継承されない**ので、色を変えたい場合は

  * ローカル SVG を白/黒で用意して `dark:invert` で対応、または
  * **インラインSVG**（JSX内に `<svg>`）にする。

---

## 8. 章03の完成イメージ（要点だけ再掲）

```tsx
// app/page.tsx（抜粋）
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Features, type Feature } from "@/components/Features";
import { FAQ } from "@/components/FAQ";

const FEATURES: Feature[] = [ /* ... */ ];

export default function Home() {
  return (
    <div className="min-h-screen px-8 sm:px-20 py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <Image className="mx-auto dark:invert" src="/icons/next.svg" alt="Next.js" width={120} height={120} />
        <Hero title="Cali Codeへようこそ！" sub="Next.js + TypeScript を Codespaces で学ぼう" />
        <Features items={FEATURES} />
        <FAQ />
      </div>
    </div>
  );
}
```

* **TSの主役ポイント**：`Props` 型、`Feature[]`、**型だけ import**、**ナローイング**。

---

## 9. よくある落とし穴（と対処）

* **型/値を混ぜて import**

  * 症状：ビルド時に「値として使えない」「ツリーシェイク不可」など
  * 対処：`import { type Foo } from '...'`
* **`@` エイリアスで解決失敗**

  * 症状：モジュールが見つからない
  * 対処：`baseUrl`/`paths` を確認。VS Code の TS サーバー再起動も有効。
* **`any` の伝播**

  * 症状：補完が効かない／型安全が崩れる
  * 対処：**最初の入口（Props / 定数）にだけ** しっかり型を置く。中は推論に任せる。
* **SVG の色が変わらない**

  * 対処：`/public/icons` に白/黒を用意＋`dark:invert`、またはインラインSVG化。

---

## 10. 復習ミニ課題（3〜5分）

1. `FAQ` を配列化して `.map()` で描画

   ```ts
   type QA = { q: string; a: string };
   const QAS: QA[] = [ /* ... */ ];
   ```
2. `FEATURES` を「配列の形は固定」と宣言

   ```ts
   const FEATURES = [
     { title: "…", desc: "…" },
   ] as const; // 値をリテラルに固定
   ```
3. **型だけ import** を外してビルド → エラーを読んで戻す

   * なぜ `type` を付けるのかを、実体験で刻む。

---

### まとめ

* 3章までで **TSの“入口”に型を置く習慣**（Props・定数）ができた
* **optional・配列・型だけ import・ナローイング** を“動くUI”で手に覚えた
* 次章（フォーム）では **zod → `z.infer`、判別共用体、Server Actions** に進み、\*\*型を“定義から自動生成”\*\*する流れを体験します。
