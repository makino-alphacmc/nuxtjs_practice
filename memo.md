## 🕒 Nuxt3 エンジニア完全スキルパック（優先度付き 100% 実務対応）

> Nuxt3 実務スキルを「1 トピック = 実務で使える単位」に分割。  
> 各トピックは **目的 / 触る場所 / 手順（例） / DoD（完了条件）** で構成。  
> すべて **Nuxt3（＋Vue3 + SSR）前提**。

---

## 🥇 優先度 1: Nuxt 基礎（根幹）

### T1. Composition API（Vue3 基本構文）

- **目的**: Nuxt3 の 90% を支える Vue3 の基礎
- **触る場所**: `<script setup>`, composables, components
- **手順（例）**: ref → reactive → computed → watch → onMounted
- **DoD**: “状態管理 + 画面反映 + 副作用”を説明し実装できる

---

### T2. Nuxt プロジェクト構造

- **目的**: Nuxt アプリの骨格理解（pages/layouts/composables）
- **触る場所**: `pages/`, `layouts/`, `components/`, `app.vue`
- **手順（例）**: pages 自動ルーティング → layout 切替 → component 読込
- **DoD**: 画面遷移 + 個別レイアウト + グローバル部品を作れる

---

### T3. SSR / CSR / Hydration 理解

- **目的**: Nuxt 特有の“どこでコードが動くか”を理解
- **触る場所**: server/api, onMounted, useFetch
- **手順（例）**: console.log で SSR/CSR の差分確認
- **DoD**: SSR / CSR の切り分け説明＋誤動作なくコード配置できる

---

### T4. useFetch / useAsyncData（データ取得コア）

- **目的**: API 取得・リロード・エラーハンドリング
- **触る場所**: 各ページの `<script setup>`, composables
- **手順（例）**: useFetch → POST/GET → キャッシュ key → transform
- **DoD**: GET/POST/更新/ステータス/エラーまで網羅して使える

---

### T5. ルーティング（useRoute / useRouter）

- **目的**: 動的ルート・クエリ・遷移制御
- **触る場所**: `pages/[id].vue`, `pages/index.vue`
- **手順（例）**: useRoute().params.id → useRouter().push()
- **DoD**: クエリ同期 + 動的遷移が実務レベルで書ける

---

### T6. Middleware（認証・アクセス制御）

- **目的**: 認証チェック・権限ルート制御
- **触る場所**: `middleware/auth.global.ts`, `middleware/auth.ts`
- **手順（例）**: 未ログイン → redirect('/login')
- **DoD**: 認証必須ページを確実に保護できる

---

### T7. useState（Nuxt 独自のグローバル状態）

- **目的**: 認証状態・ユーザー情報の保持
- **触る場所**: composables, middleware
- **手順（例）**: useState("user") → ログイン後セット
- **DoD**: SSR/CSR どちらでもブレない状態管理ができる

---

### T8. server/api（バックエンドロジック）

- **目的**: API 実装・モック作成・外部API連携
- **触る場所**: `server/api/*.ts`
- **手順（例）**: defineEventHandler → getQuery → readBody
- **DoD**: CRUD API / 外部API 取得 / バリデーションが作れる

---

## 🥇 優先度 2: UI・画面レベル

### T9. TailwindCSS（UI 基礎）

- **目的**: 画面を高速で構築
- **触る場所**: `.vue` 全般
- **手順（例）**: flex/grid → spacing → responsive → 自作UI部品化
- **DoD**: デザイン通りの UI を Tailwind のみで構築可能

---

### T10. Nuxt UI / Headless UI / shadcn

- **目的**: 実務 UI（モーダル・フォーム・ドロワー等）
- **触る場所**: components/ui/*
- **手順（例）**: Dialog/Select/Input を組み合わせる
- **DoD**: UI コンポーネント体系で画面を安定して作れる

---

### T11. フォーム・バリデーション

- **目的**: 認証フォーム・登録フォーム等の精度向上
- **触る場所**: components/forms, composables/forms
- **手順（例）**: VeeValidate / Zod → エラーUI → 再送信防止
- **DoD**: 送信・エラー表示・二重送信防止が完成されている

---

## 🥇 優先度 3: 認証・アプリ構築

### T12. 認証（JWT / Cookie / セッション）

- **目的**: ログイン・ログアウト・トークン管理
- **触る場所**: middleware, server/api/auth/*
- **手順（例）**: Cookie に JWT 保存 → middleware で検証
- **DoD**: セッションが途切れない安全な認証が作れる

---

### T13. Runtime Config（env 管理）

- **目的**: API URL / Secret を環境ごとに切替
- **触る場所**: `nuxt.config.ts`, `.env`
- **手順（例）**: useRuntimeConfig().public.apiBase
- **DoD**: dev/prod/test で env 切替が正しくできる

---

### T14. エラーハンドリング（全体設計）

- **目的**: エラーページ・例外処理・APIエラーUI
- **触る場所**: error.vue, composables, server/api/*
- **手順（例）**: throw createError → UI 表示
- **DoD**: 404/500/validation error が統一的に扱える

---

### T15. パフォーマンス（最適化）

- **目的**: 速度改善・バンドル削減・SSR最適化
- **触る場所**: nuxt.config.ts, pages
- **手順（例）**: route rules → client-only → lazy load
- **DoD**: ページ速度が改善し Lighthouse が高得点になる

---

## 🥇 優先度 4: 上級エンジニア領域

### T16. TypeScript（型安全な Nuxt）

- **目的**: 型安全なアプリ構築
- **触る場所**: *.ts, server/api/*.ts, composables/*.ts
- **手順（例）**: interface → generics → API型定義
- **DoD**: エディタで型補完が完璧に出る

---

### T17. Pinia（大規模状態管理）

- **目的**: 複雑な状態保持・モジュール化
- **触る場所**: stores/*
- **手順（例）**: defineStore → actions/getters/state
- **DoD**: 大規模SPAでも破綻しない状態構造を作れる

---

### T18. Composable 設計（useXxx）

- **目的**: 再利用ロジックの抽象化・整理
- **触る場所**: composables/useAuth.ts etc.
- **手順（例）**: 状態 + 副作用を抽象関数化
- **DoD**: “本番で使える composable 設計”が安定して作れる

---

### T19. Testing（Vitest）

- **目的**: 安全なリファクタリング
- **触る場所**: tests/*, composables/*
- **手順（例）**: composable test → mock → snapshot
- **DoD**: 主要ロジックがテスト下にある

---

### T20. デプロイ（Vercel / Cloud / Docker）

- **目的**: Nuxt を本番に動かす
- **触る場所**: nuxt.config.ts, vercel.json, Dockerfile
- **手順（例）**: env差し替え → SSRデプロイ → server/api反映
- **DoD**: 本番で正常動作 + エラー通知あり

---
