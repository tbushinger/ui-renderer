import './style.css';
import { MetaVisitor } from './src/meta/visitor';
import { BinderVisitor } from './src/binding/visitor';
import Element from './src/dom/element';
import { ElementMeta } from './src/meta/types';

const metaVisitor = MetaVisitor.create();
const binder = BinderVisitor.create();

const model = {
  newTaskText: '',
};

const getRoot = () => root;

binder.registerBinding('get', (key: string) => () => model[key]);
binder.registerBinding('set', (key: string) => {
  return (e: EventListenerOrEventListenerObject) => {
    model[key] = e.target.value;
    getRoot().render();
  };
});
binder.registerBinding(
  'noValue',
  (key: string) => () =>
    model[key] === '' || model[key] === undefined ? true : undefined
);
binder.registerBinding('addTask', () => () => {
  alert(model.newTaskText);
  model.newTaskText = '';
  getRoot().render();
});

const meta: ElementMeta = {
  tagName: 'div',
  classes: ['container'],
  styles: {
    backgroundColor: 'lightgray',
  },
  attributes: {
    id: 'myRoot',
  },
  children: [
    {
      tagName: 'div',
      classes: ['row'],
      children: [
        {
          tagName: 'input',
          attributes: {
            id: 'taskInput',
            placeholder: 'Enter Task',
            value: '@get newTaskText',
          },
          events: [
            {
              name: 'input',
              handler: '@set newTaskText',
            },
          ],
        },
      ],
    },
    {
      tagName: 'div',
      classes: ['row'],
      children: [
        {
          tagName: 'button',
          text: 'Add Task',
          attributes: {
            disabled: '@noValue newTaskText',
          },
          events: [
            {
              name: 'click',
              handler: '@addTask',
            },
          ],
        },
      ],
    },
  ],
};

const bound = binder.visit(meta);
const root = metaVisitor.visit('app', bound);

root.render();
