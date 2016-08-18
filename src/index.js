import { run } from '@cycle/rxjs-run';
import { Observable } from 'rxjs';
import { div, makeDOMDriver } from '@cycle/dom';
import firebase from 'firebase/app';

import makeFirebaseDriver from './drivers/firebaseDriver';

// components
import inputField from './components/inputField';
import messageList from './components/messageList';

const firebaseConfig = {
  apiKey: 'AIzaSyDdXQ2o-uWzKXKZqha5PoE17nKKiGarckE',
  databaseURL: 'https://cycle-chat.firebaseio.com/',
};

function main({ DOM, FIREBASE }) {
  const room$ = FIREBASE.ref('/rooms/0/messages/');
  const click$ = DOM.select('#submit').events('click');
  const messages$ = room$.events('value');

  const props$ = Observable.combineLatest(
    DOM.select('#name').events('keyup').map(x => x.target.value),
    DOM.select('#text').events('keyup').map(x => x.target.value)
  );

  const state$ = messages$.map(messages =>
    ({ messages: Object.keys(messages).map(x => messages[x]) }));

  const vdom$ = state$.map(({ messages }) =>
    div('.chatContainer', [
      messageList(messages),
      inputField(),
    ])
  );

  const sinks = {
    DOM: vdom$,
    FIREBASE: click$.withLatestFrom(props$, (btnStream, [from, text]) =>
      ({
        ref: '/rooms/0/messages/',
        type: 'push',
        data: { from, text },
      })
    ),
  };

  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  FIREBASE: makeFirebaseDriver(firebase.initializeApp(firebaseConfig)),
};

run(main, drivers);
