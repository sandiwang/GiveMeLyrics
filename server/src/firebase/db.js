const admin = require("firebase-admin")
const serviceAccount = require("./firebase-adminsdk.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://give-me-lyrics.firebaseio.com'
})

const db = admin.database()
const ref = db.ref('test/testData')

ref
	.once('value')
	.then(snapshot => snapshot.val())
	.then(data => console.log(data))