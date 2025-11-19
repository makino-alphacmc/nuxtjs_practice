# ============================================================
#  Nuxt3 学習支援 AI メモ
#  Webエンジニア基礎スキル版（REST / フォーム / 認証 / 日付 / 状態管理）
# ============================================================

# ------------------------------------------------------------
# 🎯 基本設定
# ------------------------------------------------------------

技術スタック:
  - Vue 3 + TypeScript + Nuxt 3（最新）
  - UI: Nuxt UI（または shadcn-vue 相当）+ Tailwind CSS
  - DB（サーバー学習用）: Prisma + SQLite
  - 外部 REST API: JSONPlaceholder
      https://jsonplaceholder.typicode.com/
  - 実行環境: Cursor
  - 作業場所: practice フォルダ（Nuxt プロジェクト）

学習方針（Webエンジニア基礎対応版）:
  - 1課題 = 15分のミニタスク
  - 必ず Nuxt3 の最新機能を使う:
      <script setup>
      useFetch / useAsyncData
      useRoute / useRouter
      useState（状態管理）
      middleware
      composables
  - 各課題で必ず以下のどれかの基礎を鍛える:
      非同期処理, API 連携, 配列操作, CRUD,
      フォーム, バリデーション,
      状態管理, 日付処理,
      エラーハンドリング,
      デバウンス/スロットル,
      認証（疑似）, ルーティング, Web Storage
  - JSONPlaceholder で CRUD 練習
  - Prisma は server/api の練習時のみ使用

重要な概念:
  - useFetch の SSR / CSR 挙動
      SSR = サーバーで API を叩く
      CSR = ページ遷移後にブラウザで叩く
  - 動的ルート / クエリ / パラメータ
  - CORS / フェッチタイミング
  - API レスポンスの型付けは type を基本
  - DB（Prisma）は server/api 内だけで使用し混在禁止

# ------------------------------------------------------------
# 🖌 共通スタイル設定（Nuxt UI + Tailwind）
# ------------------------------------------------------------

Nuxt UI + Tailwind 方針:
  - UI: Card / Button / Input / Textarea / Dialog / Alert
  - Tailwind で配置と余白:
      flex, grid, gap-4, p-4, rounded-xl, shadow
      w-full, max-w-2xl, mx-auto, text-neutral-100
  - ダークテーマ基準:
      背景: bg-neutral-900
      カード: bg-neutral-950
      テキスト: text-neutral-100

assets/css/main.css 内容方針:
  - Tailwind 読み込み
  - ダークテーマ CSS 変数:
      --background
      --foreground
      --primary
  - 最低限の共通スタイル（フォント、スクロールバー）

# ------------------------------------------------------------
# 📚 学習メソッド（3フェーズ × 各15分）
# ------------------------------------------------------------

# ----------------------
# Phase 1: 模写で理解
# ----------------------
目的:
  Nuxt3 × Webエンジニア基礎処理を「写経で習得」。

内容:
  - useFetch + GET 一覧表示
  - CRUD（POST / PUT / DELETE）
  - フォーム + バリデーション
  - 日付フォーマット
  - エラー表示コンポーネント
  - デバウンス付き検索
  - 簡易ログイン（疑似認証）

ルール:
  - コメント付き完全コードを AI が提供
  - 各行に理由説明
  - 処理の流れを図解:
      useFetch → API → JSON → 型付け → data → UI
  - UI は Nuxt UI + Tailwind
  - Prisma は server/api の課題の時のみ

JSONPlaceholder（CRUD課題の例）:
  - 投稿一覧       GET: https://jsonplaceholder.typicode.com/posts
  - 投稿詳細       GET: https://jsonplaceholder.typicode.com/posts/1
  - 投稿作成       POST: https://jsonplaceholder.typicode.com/posts
  - 投稿更新       PUT: https://jsonplaceholder.typicode.com/posts/1
  - 投稿削除       DELETE: https://jsonplaceholder.typicode.com/posts/1

# ----------------------
# Phase 2: 自力再現（ヒントのみ）
# ----------------------
目的:
  「コードなしの手順」だけで自分で書ける状態にする。

内容:
  - AI は手順だけ提示（コードは禁止）
  - 最初に完成UIの口頭イメージ
  - 使用すべきUIコンポーネントを記述（Card / Button / Input）
  - Tailwind のヒントを提示:
      flex, gap-4, rounded-xl, shadow, max-w-2xl
  - ダークテーマのヒントも提示:
      bg-neutral-900, bg-neutral-950
  - Phase1 とは別ファイル名で作成
  - CRUD 以外の課題も追加:
      検索フォーム（デバウンス）
      ログインフォーム（バリデ）
      日付ソート
      URL クエリフィルタ
      エラー出し分け

# ----------------------
# Phase 3: 継続練習（応用・ランダム）
# ----------------------
目的:
  パターンを応用し「実務脳」にする。

内容:
  - posts → users → comments → albums → todos と題材を差し替えて反復
  - 毎回別ファイル名で履歴確保
  - ランダム出題:
      一覧 → 詳細 → フォーム → ページング → 絞り込み
      お気に入り → 認証ガード → URL同期
  - Tailwind / Nuxt UI の微調整（色・影・角丸）
  - server/api で Proxy API 作成
      例: /api/posts → 内部で JSONPlaceholder を叩く
  - Prisma を使った自前 CRUD 版も追加可能
  - 状態管理（useState）
  - middleware（ログイン必須ページ）
  - Web Storage（テーマ・フィルタ保持）

# ------------------------------------------------------------
# 🧩 このメモの目的
# ------------------------------------------------------------
Nuxt3 を使いながら、
「Webエンジニアとして絶対に必要な基礎スキル」
（非同期 / API / 配列 / CRUD / フォーム / 状態管理 / 日付 / 認証 / エラー / ルーティング）
をすべて練習できるようにした汎用テンプレート。

# ------------------------------------------------------------
# 🚀 コピーしてそのまま学習計画として使える
# ============================================================