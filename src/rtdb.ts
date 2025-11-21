import firebase from "firebase";

const API_BASE_URL = "http://localhost:3000"
const app = firebase.initializeApp({
    apiKey: '1vUoTJlADRto4Q52jFGlEG3lwicnpZ9Zl6PcPeUJ',
    databaseURL: 'https://test-1-mathiapx-default-rtdb.firebaseio.com',
    authDomain: 'test-1-mathiapx.firebaseapp.com'
})

const rtdb = firebase.database()

export { rtdb }