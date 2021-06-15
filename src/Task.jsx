import React from 'react';
import './index.css';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import deleteButton from './deleteButton.png';

export default function Task({
  index,
  taskName,
  taskIsDone,
  taskEditNum,
  checkboxChange,
  sendTaskChange,
  clickTask,
  handleTaskChange,
  deleteTask,
}) {
  return (
    <Grid container>
      <Grid item xs={1}>
        <Checkbox checked={taskIsDone} onChange={(e) => checkboxChange(e, index)} style={{ marginTop: '0.4em' }} />
      </Grid>
      <Grid item xs={10}>
        <form onSubmit={(e) => sendTaskChange(e, index)}>
          <div role="presentation" onClick={(e) => clickTask(e, index)} onKeyDown={(e) => clickTask(e, index)}>
            {(taskEditNum === index)
              ? <TextField value={taskName} autoFocus onChange={(e) => handleTaskChange(e, index)} onBlur={(e) => sendTaskChange(e, index)} style={{ width: '100%', marginTop: '1.1em', marginBottom: '0.55em' }} />
              : <p style={{ fontSize: '1.1em', paddingLeft: '5%' }}>{taskName}</p>}
          </div>
        </form>
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={(e) => deleteTask(e, index)} style={{ marginTop: '0.5em' }}>
          <Avatar src={deleteButton} variant="square" style={{ width: '0.9em', height: '0.9em' }} />
        </IconButton>
      </Grid>
    </Grid>
  );
}

Task.propTypes = {
  index: PropTypes.number.isRequired,
  taskName: PropTypes.string.isRequired,
  taskIsDone: PropTypes.bool.isRequired,
  taskEditNum: PropTypes.number.isRequired,
  checkboxChange: PropTypes.func.isRequired,
  sendTaskChange: PropTypes.func.isRequired,
  clickTask: PropTypes.func.isRequired,
  handleTaskChange: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};
