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
import { Add, RecordCircle } from "iconsax-react";
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
    const { destination, draggableId } = result;
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
        {[
          { id: "todo", tasks: todoTasks, color: "#FFAD0D", label: "Todo" },
          {
            id: "inProgress",
            tasks: inProgressTasks,
            color: "#0C6FBF",
            label: "In Progress",
          },
          { id: "completed", tasks: completedTasks, color: "#2A7E2E", label: "Completed" },
        ].map(({ id, tasks, color, label }) => (
          <Droppable key={id} droppableId={id}>
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ textAlign: "center" }}
              >
                <div className="column-header">
                  <div className="header-left">
                    <RecordCircle size={24} color={color} />
                    <h2>{label}</h2>
                    <p>{tasks.length}</p>
                  </div>
                  <div className="header-right">
                    <Add
                      size={24}
                      color="#000000"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAddEmptyTask(id as "todo" | "inProgress" | "completed")}
                    />
                  </div>
                </div>
                {tasks.map((task, index) => (
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
                <div
                  onClick={() => handleAddEmptyTask(id as "todo" | "inProgress" | "completed")}
                  className="add-task-btn"
                >
                  <Add size={24} color="#727272" /> Add Task
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
