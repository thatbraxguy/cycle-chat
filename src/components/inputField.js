import { div, h1, h4, p, input, button } from '@cycle/dom';

const view = () =>
  div('#inputField', [
    input('#name', { attrs: { placeholder: 'username' }}),
    input('#text', { attrs: { placeholder: 'your message...' }}),
    button('#submit', 'send')
  ]);

export default view;
