import { Subject } from 'rxjs';
import 'firebase/database';
import api from './firebaseAPI';

let app = {};
const refs = {};

const makeRef = path => {
  refs[path] = refs[path] || app.database().ref(path);
  return refs[path];
};

const makeRefStream = (ref, events) => {
  const stream$ = new Subject();
  events.map(e => ref.on(e, x => stream$.next(x.val())));
  return stream$;
};

const sources = () => ({
  ref: path => {
    makeRef(path);

    return {
      events: events => makeRefStream(refs[path], events.split(' ')),
    };
  },
});

export default function (firebase) {
  app = firebase;

  return stream$ => {
    stream$.map(e => api(refs[e.ref])[e.type](e.data));
    return sources();
  };
}
