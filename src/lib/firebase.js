import firebase from 'firebase/app';
import 'firebase/database';


const init = (config) => {
  firebase.initializeApp(config);
  return firebase.database();
}

export default init;
