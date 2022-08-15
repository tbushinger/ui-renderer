import './style.css';
import { MetaVisitor } from './src/meta/visitor';

const visitor = MetaVisitor.create();

const model = {
  newTaskText: '',
};

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
            value: () => model.newTaskText,
          },
          events: [
            {
              name: 'change',
              handler: (e) => {
                model.newTaskText = e.target.value;
                root.render();
              },
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
          text: () => `Add: ${model.newTaskText}`,
          events: [
            {
              name: 'click',
              handler: () => {
                alert(model.newTaskText);
                model.newTaskText = '';
                root.render();
              },
            },
          ],
        },
      ],
    },
  ],
});

root.render();
