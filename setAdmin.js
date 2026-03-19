const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "neEDcZ1v2STLKx8PJVVaANnC8gr1";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin role set successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
    process.exit(1);
  });