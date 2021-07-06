import { init } from 'next-firebase-auth'

export const initUserAuth = () => {
  init({
    authPageURL: '/auth/signin',
    appPageURL: '/',
    loginAPIEndpoint: '/api/user/login', // required
    logoutAPIEndpoint: '/api/user/logout', // required
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.FIREBASE_ADMINSDK_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMINSDK_CLIENT_EMAIL,
        // The private key must not be accesssible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      },
      databaseURL: `https://${process.env.FIREBASE_ADMINSDK_PROJECT_ID}.firebaseio.com`,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // required
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMIAN,
      databaseURL: `https://${process.env.FIREBASE_ADMINSDK_PROJECT_ID}.firebaseio.com`,
      projectId: process.env.FIREBASE_ADMINSDK_PROJECT_ID,
    },
    cookies: {
      name: 'user', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
  })
}