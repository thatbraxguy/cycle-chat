import Cycle from '@cycle/core';
import { makeDOMDriver } from '@cycle/dom';
import { div, p, input } from '@cycle/dom';
import { Observable } from 'rx';

function main(sources) {
  const sinks = {
    DOM: sources.DOM
      .select('input')
      .events('click')
      .map(e => e.target.checked)
      .startWith(false)
      .map(toggled =>
        div([
          input({ attrs: { type: 'checkbox' } }),
          'Toggle me',
          p(toggled ? 'ON' : 'OFF')
        ])
      )
  };

  return sinks;
};

const drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
