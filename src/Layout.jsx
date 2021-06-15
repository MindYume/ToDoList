import React from 'react';
import { styled } from '@material-ui/core/styles';
import './index.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import List from './List';

// Адрес сервера, на котором схраняются данные
/* В данный момент в .env файл записан адрес mock-сервера.
   Данный сервер создаётся каждый раз заного после перезагрузки страницы,
   так что данные не будут сохраняться.
   Если использовать адрес json-сервера или других рабочих серверов,
   данные будут сохраняться. */
const serverUrl = process.env.REACT_APP_URL;

const PaperStyled = styled(Paper)({
  width: '40rem',
  margin: 'auto',
  marginTop: '5%',
  paddingLeft: '0.5%',
  paddingRight: '2%',
  paddingTop: '0.5%',
  paddingBottom: '0.5%',
});

const TaskEnterField = styled(TextField)({
  width: '74%',
});

const TaskAddButton = styled(Button)({
  width: '24%',
  height: '4em',
  marginLeft: '2%',

  color: '#04BE00',
  borderColor: '#04BE00',
});

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    /*
      input - строка ввода новой задачи

      tasks - список задач. У каждой задачи есть
        name (название),
        id,
        isDone (равна true, если задача выполнена и false, если нет)

      taskEditNum - номер задачи, которая в данный момент редактируется. Если в данный момент
        никакая задача не редактируется, значение переменной равно -1

      isLoaded - в начале равна false. Пока находится в состоянии false,
        программа постоянно пытается загрузить данные с сервера.
        Когда удалось загрузить данные, значение становится равно true.
    */
    this.state = {
      input: '',
      tasks: [],
      taskEditNum: -1,
      isLoaded: false,
    };

    this.inputChange = this.inputChange.bind(this);
    this.addTask = this.addTask.bind(this);
    this.clickTask = this.clickTask.bind(this);
    this.sendTaskChange = this.sendTaskChange.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.checkboxChange = this.checkboxChange.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  // Изменяет название задачи по индексу после нажатия кнопки Enter.
  handleTaskChange(event, index) {
    const { tasks } = this.state;
    tasks[index].name = event.target.value;
    this.setState((prevState) => ({ tasks: [...prevState.tasks] }));
  }

  // Изменяет состояние элемента checkbox и отправляет изменения на серсер.
  checkboxChange(event, index) {
    const { tasks } = this.state;
    const task = { ...tasks[index] };
    axios({
      method: 'PATCH',
      url: serverUrl + tasks[index].id,
      data: {
        isDone: event.target.checked,
      },
    });

    task.isDone = event.target.checked;
    tasks[index] = task;

    this.setState({ tasks });
  }

  // Изменяет состояние строки ввода.
  inputChange(event) {
    this.setState({ input: event.target.value });
  }

  /* Добавляет задачу из строки "this.state.input"
     в массив "this.state.tasks" и отправляет её на сервер. */
  addTask(event) {
    event.preventDefault();
    const { input } = this.state;
    const { tasks } = this.state;
    if (input.length > 0) {
      axios({
        method: 'POST',
        url: serverUrl,
        data: {
          name: input,
          isDone: false,
        },
      });

      if (tasks.length > 0) {
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, {
            name: prevState.input,
            isDone: false,
            id: prevState.tasks[prevState.tasks.length - 1].id + 1,
          }],
        }));
      } else {
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, {
            name: prevState.input,
            isDone: false,
            id: 1,
          }],
        }));
      }

      this.setState({ input: '' });
    }
  }

  /* Отправляет изменённое название задачи на сервер.
     Если длина названия равна нулю, она удаляется, в том числе и на сервере. */
  sendTaskChange(event, index) {
    event.preventDefault();
    const { tasks } = this.state;
    if (tasks[index].name.length === 0 || tasks[index].name[0] === ' ') {
      axios({
        method: 'DELETE',
        url: serverUrl + tasks[index].id,
      });
      tasks.splice(index, 1);
    } else {
      axios({
        method: 'PATCH',
        url: serverUrl + tasks[index].id,
        data: {
          name: tasks[index].name,
        },
      });
    }
    this.setState((prevState) => ({
      tasks: [...prevState.tasks],
      taskEditNum: -1,
    }));
  }

  /* При нажатии на задачу в переменную "this.state.taskEditNum" записывается номер задачи,
     и задача переходит в режм редактирования. */
  clickTask(_event, index) {
    this.setState({
      taskEditNum: index,
    });
  }

  // Удаляет задачу по индексу, в том числе и на сервере.
  deleteTask(_event, index) {
    const { tasks } = this.state;
    axios({
      method: 'DELETE',
      url: serverUrl + tasks[index].id,
    });

    tasks.splice(index, 1);
    this.setState((prevState) => ({ tasks: [...prevState.tasks] }));
  }

  render() {
    const { input } = this.state;
    const { tasks } = this.state;
    const { taskEditNum } = this.state;
    const { isLoaded } = this.state;

    // Загружает данные из сервера.
    if (isLoaded === false) {
      axios({
        method: 'GET',
        url: serverUrl,
      })
        .then((response) => {
          this.setState({
            tasks: [...response.data],
            isLoaded: true,
          });
        });
    }

    return (
      <PaperStyled elevation={3}>
        <div>
          <form onSubmit={this.addTask}>
            <TaskEnterField label="Task" value={input} onChange={this.inputChange} variant="outlined" />
            <TaskAddButton type="Submit" variant="outlined">Add</TaskAddButton>
          </form>
          <List
            tasks={tasks}
            taskEditNum={taskEditNum}
            checkboxChange={this.checkboxChange}
            sendTaskChange={this.sendTaskChange}
            clickTask={this.clickTask}
            handleTaskChange={this.handleTaskChange}
            deleteTask={this.deleteTask}
          />
        </div>
      </PaperStyled>
    );
  }
}
