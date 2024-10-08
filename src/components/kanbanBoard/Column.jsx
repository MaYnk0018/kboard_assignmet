import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import './kanbanBoard.css'
import TaskCard from './TaskCard'

function Column({title,tasks,id}) {
  return <>
    <div className='columnContainer'>
      <div className="columnTitle" style={{backgroundColor : "blue" , position : "sticky"}}>
        {title}
      </div>
      <Droppable droppableId={id}>
        {
          (provided,snapshot) => {
            return <div className='columnTaskList' ref={provided.innerRef}{...provided.droppableProps} isdraggingover={snapshot.isDraggingOver}>
              {
                tasks.length > 0 ? tasks.map((task,index) => {
                  return <TaskCard key={index} index={index} task={task}/>
                }) : <h5 style={{zIndex:"15", color : "black", textAlign : "center", marginTop : "1rem"}}>No Tasks</h5>
              }
              {provided.placeholder}
            </div>
          }
        }
      </Droppable>
    </div>
  </>
}

export default Column