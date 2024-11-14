"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { createEmptyTask, updateTask } from "../features/tasks/taskSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

export default function TaskBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inProgress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleAddEmptyTask = (status: "todo" | "inProgress" | "completed") => {
    dispatch(createEmptyTask({ status }));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as
      | "todo"
      | "inProgress"
      | "completed";

    dispatch(
      updateTask({ id: draggableId, field: "status", value: newStatus })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board grid grid-cols-3 gap-4 bg-slate-50">
        <Droppable droppableId="todo">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ textAlign: "center" }}
            >
              <h2>Todo ({todoTasks.length})</h2>
              {todoTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button
                onClick={() => handleAddEmptyTask("todo")}
                className="add-task-btn"
              >
                + Add Task
              </button>
            </div>
          )}
        </Droppable>
        <Droppable droppableId="inProgress">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ textAlign: "center" }}
            >
              <h2>In Progress ({inProgressTasks.length})</h2>
              {inProgressTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button
                onClick={() => handleAddEmptyTask("inProgress")}
                className="add-task-btn"
              >
                + Add Task
              </button>
            </div>
          )}
        </Droppable>
        <Droppable droppableId="completed">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ textAlign: "center" }}
            >
              <h2>Completed ({completedTasks.length})</h2>
              {completedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <button
                onClick={() => handleAddEmptyTask("completed")}
                className="add-task-btn"
              >
                + Add Task
              </button>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
