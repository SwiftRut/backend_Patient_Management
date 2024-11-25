import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();
let serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
console.log(serviceAccount);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://event-management-app-301ba-default-rtdb.firebaseio.com"
});

export default admin;