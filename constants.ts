// FIREBASE_EXPIRES_INの計算の仕方: ミリ秒 * 秒 * 分 * 時 * 日（Firebaseはm秒計算が必要）
export const FIREBASE_EXPIRES_IN = 1000 * 60 * 60 * 24 * 7
// NOOKIES_EXPIRES_INの計算の仕方:  秒 * 分 * 時 * 日
export const NOOKIES_EXPIRES_IN = 60 * 60 * 24 * 7
export const GRAPHQL_ENTRY_POINT = `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`