import Cycle from '@cycle/core';
import { div, p, h4, input, button } from '@cycle/dom';
import { Observable, Subject } from 'rx';

// drivers
import { makeDOMDriver } from '@cycle/dom';
import makeFirebaseDriver from './drivers/firebaseDriver';

// components
import inputField from './components/inputField';
import messageList from './components/messageList';

const firebaseConfig = {
  apiKey: 'AIzaSyDdXQ2o-uWzKXKZqha5PoE17nKKiGarckE',
  databaseURL: 'https://cycle-chat.firebaseio.com/'
};

function main(sources) {
  const room$ = sources.FIREBASE.ref('/rooms/0/messages/')
  const click$ = sources.DOM.select('#submit').events('click');
  const messages$ = room$.events('value');

  const state$ = messages$.map(messages =>
    ({ messages: Object.keys(messages).map(x => messages[x]) }));

  const vdom$ = state$.map(({ messages }) =>
    div('.chatContainer', [
      messageList(messages),
      inputField()
    ])
  );

  const sinks = {
    DOM: vdom$,
    FIREBASE: click$.map(() => {
      const from = document.querySelector('#name').value;
      const text = document.querySelector('#text').value;
      document.querySelector('#text').value = '';

      return room$.push({ from, text });
    })
  };

  return sinks;
};

const drivers = {
  DOM: makeDOMDriver('#app'),
  FIREBASE: makeFirebaseDriver(firebaseConfig)
};

Cycle.run(main, drivers);