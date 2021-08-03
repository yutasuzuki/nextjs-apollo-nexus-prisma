# Next.js + Apollo + Nexus + Prisma

graphqlのschemaも追加したら`npx prisma generate`する。prisma-nexusで引数が反映されないため。

## Prisma

###　コマンド

#### migrate
```
npx prisma migrate dev --name マイグレードファイル名
npx prisma generate
```

### リセットやマイグレートができない時

```
// Reset用のDBに一度置き換えたものを構築する
npx prisma db push --accept-data-loss --schema=./prisma/reset.prisma
// schema.prismaから再構築する
npx prisma db push --accept-data-loss
```

## 注意事項

### schema.graphqlが変更されない時

graphql/schemas/*を編集してもschema.graphqlが変更されない時は、一度フォルダごと削除してサーバーを再起動し、ブラウザでページにアクセスする。サーバーの再起動では再生成されないし、生成に時間がかかることもある。