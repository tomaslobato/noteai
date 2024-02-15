// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "noteai-5091a.firebaseapp.com",
  projectId: "noteai-5091a",
  storageBucket: "noteai-5091a.appspot.com",
  messagingSenderId: "662760622337",
  appId: "1:662760622337:web:9ffed6d6ea464d45617300",
  measurementId: "G-31EDFDYY0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFileToFirebase(image_url: string, name: string) {
    try {
        const res = await fetch(image_url)
        const buffer = await res.arrayBuffer()
        const fileName = name.replace(' ', '') + Date.now + '.jpeg'
        const storageRef = ref(storage, fileName)
        await uploadBytes(storageRef, buffer, {
            contentType: 'image/jpeg'
        })
        const fireabaseUrl = await getDownloadURL(storageRef)
        return fireabaseUrl
    } catch (error) {
        console.error(error)
    }
}