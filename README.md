# Next.js + Firebase Authentication + Apollo + Nexus + Prisma

このプロジェクトは企業向けの管理画面でユーザー認証のみを実装したテンプレートです。

以下の技術を採用しています。

- Next.js
- Firebase Authentication
- Apollo-client, Apollo-server
- Nexus
- Prisma
- MySQL

## Usage

```
npm i 
npx prisma db push --accept-data-loss
```

### Prisma

#### migrate
```
npx prisma migrate dev --name マイグレードファイル名
npx prisma generate
```

#### リセットやマイグレートができない時

注）開発時に適時使用してください。

```
// Reset用のDBに一度置き換えたものを構築する
npx prisma db push --accept-data-loss --schema=./prisma/reset.prisma
// schema.prismaから再構築する
npx prisma db push --accept-data-loss
```

### Nexus

#### schema.graphqlが変更されない時

`graphql/schemas/*`を編集してもschema.graphqlが変更されない事があります。
`graphql/_generated`フォルダごと削除してサーバーを再起動し、ブラウザでページにアクセスしてください。サーバーの再起動では再生成されず、生成に時間がかかることもあります。


