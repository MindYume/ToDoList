import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import Task from './Task';

export default function List({
  tasks,
  taskEditNum,
  checkboxChange,
  sendTaskChange,
  clickTask,
  handleTaskChange,
  deleteTask,
}) {
  return (
    <div>
      {tasks.map((item, index) => (
        <Task
          key={index.toString()}
          index={index}
          taskName={item.name}
          taskIsDone={item.isDone}
          taskEditNum={taskEditNum}
          checkboxChange={checkboxChange}
          sendTaskChange={sendTaskChange}
          clickTask={clickTask}
          handleTaskChange={handleTaskChange}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}

List.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    isDone: PropTypes.bool,
    id: PropTypes.number,
    map: PropTypes.func,
  })).isRequired,
  taskEditNum: PropTypes.number.isRequired,
  checkboxChange: PropTypes.func.isRequired,
  sendTaskChange: PropTypes.func.isRequired,
  clickTask: PropTypes.func.isRequired,
  handleTaskChange: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};
