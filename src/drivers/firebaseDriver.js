import { Subject } from 'rx';
import firebase from 'firebase/app';
import 'firebase/database';

const makeRefStream = (ref, events) => {
  const stream$  = new Subject();
  events.map(e => ref.on(e, x => stream$.onNext(x.val())));
  return stream$;
};

export default function (config) {
  firebase.initializeApp(config);

  return (stream$) => {
    console.log('fb driver', stream$);
    stream$.map(msg => console.log('fb driver', msg));

    return ({
      ref: path => {
        const refObj = firebase.database().ref(path);
        return {
          events: events => makeRefStream(refObj, events.split(' ')),
          push: data => refObj.push(data)
        }
      },
    });
  };
};
