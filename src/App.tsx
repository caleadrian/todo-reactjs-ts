import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { submitTask, doneTask, TaskState, removeTask } from './features/taskSlice';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { v4 as uuidv4 } from 'uuid';
import classNames from "classnames";

function App() {

  return (
    <div className="App max-w-2xl bg-gray-100 overflow-hidden h-screen mx-auto pt-10 px-3 flex flex-col flex-1">
      <Header />
      <div className='py-2'>
        <TaskItemList />
      </div>
      <Footer />
    </div>
  );
}

const Header = () => {
  return <div className='text-4xl font-semibold mb-3'>Todo Tasks</div>
}

// FOoter
const Footer = () => {
  const taskList = useAppSelector(state => state.task);
  const [showInputForm, setShowInputForm] = useState(false);

  const toogle = () => {
    setShowInputForm(d => !d)
  }

  return (
    <div className='mt-auto flex flex-col items-center'>
      <InputForm show={showInputForm} />
      <div className='bg-white rounded-sm w-full pb-10 pt-10 h-25 flex justify-center items-center z-10 relative'>
        <div className='self-center ml-5 text-xs text-gray-400'>{taskList.length} Tasks</div>
        <button className='ml-auto bg-green-500 h-8 w-20 mr-5 text-sm rounded-sm text-white hover:bg-opacity-60' onClick={() => toogle()}>{showInputForm ? 'Close' : 'Add'}</button>
      </div>
    </div>

  )
}


const TaskItem = (task: TaskState) => {
  const [remove, setRemove] = useState(false);
  const dispatch = useAppDispatch();

  const isDone = task.status === 'done';
  const variants = {
    add: { opacity: 1 },
    remove: { opacity: 0, x: 100 }
  }

  const handleOnAnimationComplete = (task: TaskState) => {
    if (remove) {
      console.log(task.text)
      dispatch(removeTask(task));
    }
  }
  return (

    <motion.div
      variants={variants}
      animate={remove ? 'remove' : 'add'}
      transition={{ duration: 0.8 }}
      onAnimationComplete={() => handleOnAnimationComplete(task)}
      className="opacity-0"
    >
      <div className="flex justify-between bg-white mb-1 p-2 rounded text-sm">
        <div className={classNames({ 'line-through': isDone })}>{task.text}</div>

        <div className='grid grid-flow-col gap-3'>
          <button onClick={() => dispatch(doneTask(task))} className={` ${classNames({ 'text-gray-300 cursor-auto': isDone, 'text-green-500 hover:font-medium': !isDone })}`}>Done</button>
          <button className='text-blue-500 hover:font-medium'>Edit</button>
          <button onClick={() => setRemove(true)} className='text-red-500 hover:font-medium'>Remove</button>
        </div>
      </div>
    </motion.div>

  )
}

const TaskItemList = () => {
  const taskList = useAppSelector(state => state.task);
  return (
    <div>


      {taskList.length > 0 ?
        (<AnimatePresence initial={true} onExitComplete={() => console.log('exited')}>
          {taskList.map((task: TaskState, i: number) => <TaskItem key={task.id} {...task} />
          )}
        </AnimatePresence>)

        : (
          <div className='text-sm text-gray-400'>No Task</div>
        )}
    </div>
  )
}

interface InputFormInterface {
  show: boolean
}

// Input Form
const InputForm = ({ show }: InputFormInterface) => {

  const dispatch = useAppDispatch();

  const [task, setTask] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = uuidv4()
    const newTask: TaskState = {
      id: id,
      text: task,
      status: 'new',
    }
    dispatch(submitTask(newTask));
    setTask('');

  }

  const variants = {
    up: { y: -140 },
    down: { y: 0 }
  }

  return (
    <motion.div
      variants={variants}
      animate={show ? 'up' : 'down'}
      transition={{ duration: 0.5 }}
    >
      <div className='bg-white py-10 px-20 rounded z-0 relative top-32 shadow-lg max-w-xl'>
        <form className='form-containe flex justify-center' onSubmit={(e) => handleSubmit(e)}>
          <input minLength={4} required value={task} onChange={e => setTask(e.target.value)} className='border text-sm py-1 px-2 rounded-sm mr-1' type="text" placeholder='Enter task' />
          <button type='submit' className='bg-green-500 h-8 w-20 text-sm text-white rounded-sm hover:bg-opacity-60'>Submit</button>
        </form>
      </div>
    </motion.div>

  )
}

export default App;
