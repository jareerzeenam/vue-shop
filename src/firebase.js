import firebase from "firebase";
import 'firebase/storage';
require("firebase/firestore");

//! Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBCv6M0jxdThtemiPONCzTyA50U2o0uwG4",
  authDomain: "vue-shop-77949.firebaseapp.com",
  databaseURL: "https://vue-shop-77949.firebaseio.com",
  projectId: "vue-shop-77949",
  storageBucket: "vue-shop-77949.appspot.com",
  messagingSenderId: "177487428860",
  appId: "1:177487428860:web:3e64c2d6add03f3f032b79",
  measurementId: "G-6G3C24464G",
};
//! Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export {fb,db}

firebase.analytics();
