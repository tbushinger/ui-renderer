import './style.css';
import { MetaVisitor } from './src/meta/visitor';
import Element from './src/dom/element';

const visitor = MetaVisitor.create();

const model = {
  newTaskText: '',
};

const viewModelFactory = (getRoot: () => Element, model: any): any => {
  return {
    get: (key: string) => {
      return () => model[key];
    },
    set: (key: string) => {
      return (e: EventListenerOrEventListenerObject) => {
        model[key] = e.target.value;
        getRoot().render();
      };
    },
    noValue: (key: string) => {
      return () =>
        model[key] === '' || model[key] === undefined ? true : undefined;
    },
    addTask: () => {
      return () => {
        alert(model.newTaskText);
        model.newTaskText = '';
        root.render();
      };
    },
  };
};

const mv = viewModelFactory(() => root, model);

const root = visitor.visit('app', {
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
            value: mv.get('newTaskText'),
          },
          events: [
            {
              name: 'input',
              handler: mv.set('newTaskText'),
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
          text: () => `Add: ${mv.get('newTaskText')()}`,
          attributes: {
            disabled: mv.noValue('newTaskText'),
          },
          events: [
            {
              name: 'click',
              handler: mv.addTask(),
            },
          ],
        },
      ],
    },
  ],
});

root.render();
