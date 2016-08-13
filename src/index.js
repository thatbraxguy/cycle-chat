import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { div, p, h4, input, button } from '@cycle/dom';
import { Observable, Subject } from 'rx';


const firebaseConfig = {
  apiKey: 'AIzaSyDdXQ2o-uWzKXKZqha5PoE17nKKiGarckE',
  // authDomain,
  // storageBucket
  databaseURL: 'https://cycle-chat.firebaseio.com/'
};

 import makeFirebaseDriver from './firebaseDriver';

const chatbox = div('.chatbox', [
  input('#name'),
  input('#text'),
  button('#sendBtn', 'send')
])

function main(sources) {
  const click$ = sources.DOM.select('#sendBtn').events('click');
  const messages$ = sources.FIREBASE.ref('/rooms/0/messages/').events('value');

  const vdom$ = messages$.map(messages => {
    let chat = [];
    if (messages) {
      chat = Object.keys(messages).map(key => {
        const m = messages[key];

        console.log('make dom', m.from, m.text);
        return div('.message', [
          h4(m.from),
          p(m.text)
        ])
      });
    }

    return div('.chatContainer', [
      div('.messages', chat),
      chatbox
    ]);
  });

  const sinks = {
    DOM: vdom$,
    FIREBASE: click$.map(() => {
      const from = document.querySelector('#name').value;
      const text = document.querySelector('#text').value;

      return sources.FIREBASE.ref('/rooms/0/messages/').push({ from, text });
    })
  };

  return sinks;
};

const drivers = {
  DOM: makeDOMDriver('#app'),
  FIREBASE: makeFirebaseDriver(firebaseConfig)
};

Cycle.run(main, drivers);
