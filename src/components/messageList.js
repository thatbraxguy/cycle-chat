import { div, span, h4, p, input, button } from '@cycle/dom';

const message = ({ from, text }) =>
  div('.message', [
    p('.from',
      { style: { display: 'inline' } },
      `${from}: `),
    span(text)
  ]);

const view = messages =>
   div('.messages',
    { style: { height: '60vh', width: '40vw', overflowY: 'scroll' } },
    messages.map(message));

export default view;
