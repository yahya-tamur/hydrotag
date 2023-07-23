import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

//I think we're only supposed to do this once.
export const app = initializeApp(firebaseConfig);
