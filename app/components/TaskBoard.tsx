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
import { Add, EmojiHappy, RecordCircle } from "iconsax-react";
import "../styles/TaskBoard.css";

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
      <div className="task-board grid grid-cols-3 gap-4">
        <Droppable droppableId="todo">
          {(provided) => (
            <div
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ textAlign: "center" }}
            >
              <div className="column-header">
                <div className="header-left">
                  <RecordCircle size={24} color="#FFAD0D" />
                  <h2>Todo</h2>
                  <p>{todoTasks.length}</p>
                </div>
                <div className="header-right">
                  <Add size={24} color="#000000" />
                </div>
              </div>

              {/* <EmojiHappy color="#000000" variant="Bulk" size={32} /> */}
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
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ textAlign: "center" }}
            >
              <div className="column-header">
                <div className="header-left">
                  <RecordCircle size={24} color="#0C6FBF" />
                  <h2>In Progress</h2>
                  <p>{inProgressTasks.length}</p>
                </div>
                <div className="header-right">
                  <Add size={24} color="#000000" />
                </div>
              </div>
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
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ textAlign: "center" }}
            >
              <div className="column-header">
                <div className="header-left">
                  <RecordCircle size={24} color="#2A7E2E" />
                  <h2>Completed</h2>
                  <p>{completedTasks.length}</p>
                </div>
                <div className="header-right">
                  <Add size={24} color="#000000" />
                </div>
              </div>
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
