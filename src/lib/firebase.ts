import admin from 'firebase-admin'
import { env } from '../../env'

if (!admin.apps.length) {
  if (env.FCM_PROJECT_ID && env.FCM_PRIVATE_KEY && env.FCM_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FCM_PROJECT_ID,
        clientEmail: env.FCM_CLIENT_EMAIL,
        // Resolve escapes de nova linha no env
        privateKey: env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  } else {
    console.warn(
      'Firebase Admin não inicializado: Variáveis de ambiente ausentes.',
    )
  }
}

export const firebaseAdmin = admin
