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
