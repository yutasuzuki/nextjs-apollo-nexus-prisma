import admin from "firebase-admin"
const FIREBASE_ADMINSDK = {
  "type": process.env.FIREBASE_ADMINSDK_TYPE,
  "project_id": process.env.FIREBASE_ADMINSDK_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_ADMINSDK_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_ADMINSDK_PRIVATE_KEY,
  "client_email": process.env.FIREBASE_ADMINSDK_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_ADMINSDK_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_ADMINSDK_AUTH_URI,
  "token_uri": process.env.FIREBASE_ADMINSDK_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_ADMINSDK_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_ADMINSDK_CLIENT_X509_CERT_URL
}
const { project_id, client_email, private_key } = FIREBASE_ADMINSDK

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: project_id,
      clientEmail: client_email,
      privateKey: private_key.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${project_id}.firebaseio.com`,
  });
}

export default admin