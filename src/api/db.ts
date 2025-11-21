import admin from "firebase-admin";

import dotenv from "dotenv";
dotenv.config()


const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    token_uri: process.env.TOKEN_URI,
}


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: 'https://test-1-mathiapx-default-rtdb.firebaseio.com'
});


const firestore = admin.firestore()
const rtdb = admin.database()

export { firestore, rtdb }