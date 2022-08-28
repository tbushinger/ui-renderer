import './style.css';
import Application from './src';
import { ElementMeta } from './src/meta/types';

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
    {
      tagName: 'div',
      classes: ['row'],
      attributes: {
        id: 'tasks',
      },
      children: [],
    },
  ],
};

const taskTemplate = {
  tagName: 'div',
  styles: {
    textAlign: 'left',
  },
  children: [
    {
      tagName: 'div',
      text: '@get',
      styles: {
        textAlign: 'left',
        display: 'inline-block',
        width: '100px',
      },
    },
    {
      tagName: 'button',
      text: 'Delete',
      events: [
        {
          name: 'click',
          handler: '@removeTask',
        },
      ],
    },
  ],
};

const taskModel = (text: string, task: Application) => {
  return {
    get: () => () => text,
    removeTask: () => () => {
      task.dispose();
    },
  };
};

const model = (render: () => void) => {
  const model = {
    newTaskText: '',
  };

  return {
    get: (key: string) => () => model[key],
    set: (key: string) => {
      return (e: EventListenerOrEventListenerObject) => {
        model[key] = e.target.value;
        render();
      };
    },
    noValue: (key: string) => () =>
      model[key] === '' || model[key] === undefined ? true : undefined,
    addTask: () => () => {
      const task = Application.create('tasks', taskTemplate);
      task.registerModel(taskModel(model.newTaskText, task));
      task.render();

      model.newTaskText = '';

      render();
    },
  };
};

const main = Application.create('app', meta);

main.registerModel(model(() => main.render())).render();
