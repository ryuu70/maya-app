# Stripe決済システム設定ガイド

## 1. Stripeアカウントの設定

1. [Stripe](https://stripe.com)でアカウントを作成
2. ダッシュボードからAPIキーを取得

## 2. 環境変数の設定

`.env.local`ファイルに以下を追加してください：

```env
# Stripe設定
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# NextAuth設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# データベース設定
DATABASE_URL="postgresql://username:password@localhost:5432/maya_app"
```

### 設定確認

設定後、以下のURLでStripe設定を確認できます：
```
http://localhost:3000/api/debug/stripe
```

## 3. Stripe Price IDの設定

### 方法1: 管理画面から作成（推奨）

1. アプリケーションにログイン
2. `/admin/stripe`にアクセス
3. 「新しい価格を作成」フォームで価格を作成
4. 作成されたPrice IDをコピー

### 方法2: Stripeダッシュボードから作成

1. Stripeダッシュボードで「商品」→「価格」から新しい価格を作成
2. 作成したPrice IDを`src/app/pricing/page.tsx`の`priceId`に設定：

```typescript
const plans = [
  {
    name: "ベーシック",
    price: "¥660/月",
    priceId: "price_xxxxxxxxxxxxx", // 実際のPrice IDに置き換え
    // ...
  },
  {
    name: "プレミアム", 
    price: "¥3,300/月",
    priceId: "price_xxxxxxxxxxxxx", // 実際のPrice IDに置き換え
    // ...
  }
]
```

### 価格一覧の確認

管理画面（`/admin/stripe`）で既存の価格一覧を確認できます。

## 4. Webhookの設定

### 本番環境での設定

1. Stripeダッシュボードで「開発者」→「Webhook」に移動
2. 新しいエンドポイントを追加：
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - イベント: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Webhookシークレットを環境変数に設定

### ローカル環境でのテスト

1. Stripe CLIでログイン：
   ```bash
   stripe login
   ```

2. Webhookをローカルにフォワード：
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. テストイベントを送信：
   ```bash
   stripe trigger checkout.session.completed
   ```

## Webhook動作確認の完全ガイド

Webhookが正常に動作することを確認するための包括的なシステムを作成しました。

### 1. 作成した機能

#### A. テストエンドポイント
- **`/api/webhooks/test`** - 基本的なwebhookテスト用
- 受信したデータの詳細ログ出力
- ヘッダー情報の確認

#### B. 詳細ログ機能
- Stripe webhookの受信ログ
- 署名検証の詳細
- イベントタイプとIDの記録

#### C. 管理画面
- **`/admin/webhooks`** - Webhook管理専用ページ
- リアルタイム状態確認
- テスト機能
- トラブルシューティングガイド

### 2. 確認方法

#### 方法1: 管理画面で確認
```
```
- Webhook状態の確認
- 基本テストの実行
- Stripe webhookシミュレーション

#### 方法2: Stripe CLIでテスト
```bash
# Stripe CLIでログイン
stripe login

# Webhookをローカルにフォワード
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# テストイベントを送信
stripe trigger checkout.session.completed
```

#### 方法3: サーバーログで確認
```bash
npm run dev
```
- コンソールに詳細なwebhookログが表示
- 受信時刻、署名、イベントタイプを確認

### 3. 確認すべきポイント

#### ✅ 正常動作の確認項目
1. **Webhook受信** - サーバーログに受信記録
2. **署名検証** - "Webhook signature verified successfully"
3. **イベント処理** - 各イベントタイプの処理ログ
4. **レスポンス** - 200ステータスで応答

#### ❌ よくある問題
1. **署名検証エラー** - Webhookシークレットの設定確認
2. **404エラー** - エンドポイントURLの確認
3. **タイムアウト** - 処理時間の最適化
4. **CORSエラー** - ヘッダー設定の確認

### 4. 実際のテスト手順

1. **管理画面にアクセス**
   ```
   http://localhost:3000/admin/webhooks
   ```

2. **基本テストを実行**
   - 「基本テスト」ボタンをクリック
   - 成功メッセージを確認

3. **Stripe CLIでテスト**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   stripe trigger checkout.session.completed
   ```

4. **ログを確認**
   - サーバーコンソールで詳細ログを確認
   - 管理画面でテスト結果を確認

これで、Webhookが正常に動作しているかを包括的に確認できます！

## 5. テスト

1. Stripeのテストカード番号を使用してテスト決済を実行
2. Webhookが正常に動作することを確認

## 6. 本番環境での注意点

- 本番環境では`sk_live_`で始まるライブキーを使用
- WebhookのURLを本番ドメインに変更
- セキュリティヘッダーとCORS設定を確認

## 7. トラブルシューティング

### よくあるエラー

1. **署名検証エラー**: Webhookシークレットが正しく設定されているか確認
2. **Price IDエラー**: StripeダッシュボードでPrice IDが正しいか確認
3. **CORSエラー**: フロントエンドとバックエンドのドメイン設定を確認

### デバッグ方法

```bash
# ログの確認
npm run dev

# Stripe CLIでwebhookをローカルでテスト
stripe listen --forward-to localhost:3000/api/webhooks/stripe
``` 