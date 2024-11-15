import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../features/tasks/taskSlice";
import { format, differenceInDays, isToday, addDays } from "date-fns";
import "../styles/TaskCard.css";
import User from "../assets/Images/profile img.png";
import User2 from "../assets/Images/profile img (1).png";
import Avetar from "../assets/icons/user.svg";
import CalendarIcon from "../assets/icons/date.svg";
import Image from "next/image";
import TaskDrawer from "./TaskDrawer";

export const assignees = [
  { name: "John Doe", image: User },
  { name: "Jane Smith", image: User2 },
  { name: "Sam Wilson", image: User },
];

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate) : null
  ); // Store as Date object
  const [priority, setPriority] = useState(task.priority || "");
  const [selectedAssignee, setSelectedAssignee] = useState(
    task.assignee || null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [remainingTimeText, setRemainingTimeText] = useState("");

  const handleFieldChange = (field, value) => {
    dispatch(updateTask({ id: task.id, field, value }));
  };

  const handleAssigneeChange = (assignee) => {
    setSelectedAssignee(assignee);
    handleFieldChange("assignee", assignee);
    setShowDropdown(false);
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setDueDate(selectedDate);
    handleFieldChange("dueDate", selectedDate.toISOString()); // Store ISO format for accuracy
    setShowDatePicker(false);

    updateRemainingTimeText(selectedDate);
  };

  const getPriorityStyle = () => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const handlePrioritySelect = (value) => {
    setPriority(value);
    handleFieldChange("priority", value);
    setShowPriorityDropdown(false);
  };

  const updateRemainingTimeText = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const daysDifference = differenceInDays(selectedDate, today);

    if (daysDifference > 1) {
      setRemainingTimeText(`Should complete within ${daysDifference} days`);
    } else if (daysDifference === 1) {
      setRemainingTimeText("Should complete within tomorrow");
    } else if (isToday(selectedDate)) {
      setRemainingTimeText("Should complete within today");
    } else if (daysDifference === -1) {
      setRemainingTimeText("Should've completed yesterday");
    } else {
      setRemainingTimeText(
        `Should've completed ${Math.abs(daysDifference)} days ago`
      );
    }
  };

  useEffect(() => {
    if (dueDate) {
      updateRemainingTimeText(dueDate);
    }
  }, [dueDate]);

  return (
    <div className="border rounded-lg p-4 bg-gray-50 shadow-sm w-full max-w-md mb-3">
      <div onClick={() => setIsDrawerOpen(true)}>open</div>
      <div className="mb-2">
        <input
          type="text"
          value={title}
          placeholder="Write a task name"
          onChange={(e) => {
            setTitle(e.target.value);
            handleFieldChange("title", e.target.value);
          }}
          disabled={!!title && !!dueDate && !!priority}
          className="w-full p-2 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-500 border-none"
        />
      </div>
      <p style={{ color: "gray", textAlign: "justify" }}>
        {task.description && task.description.length > 100
          ? `${task.description.substring(0, 100)}...`
          : task.description}
      </p>
      <div className="flex items-center space-x-3 mt-2">
        <div className="w-1/3 relative">
          {selectedAssignee ? (
            <Image
              src={selectedAssignee.image}
              width={40}
              height={40}
              alt="Picture of the author"
            />
          ) : (
            <Image
              src={Avetar}
              width={40}
              height={40}
              alt="Picture of the author"
              onClick={() => setShowDropdown(true)}
            />
          )}
          {showDropdown && (
            <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-2 w-full max-h-48 overflow-y-auto">
              {assignees.map((assignee) => (
                <div
                  key={assignee.name}
                  onClick={() => handleAssigneeChange(assignee)}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                >
                  <Image
                    src={assignee.image}
                    width={40}
                    height={40}
                    alt="Picture of the author"
                  />
                  <span>{assignee.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/3 relative">
          {dueDate ? (
            <span
              className="cursor-pointer text-gray-700"
            >
              {format(dueDate, "dd MMM")}
            </span>
          ) : (
            <Image
              src={CalendarIcon}
              width={40}
              height={40}
              alt="Calendar icon"
              onClick={() => setShowDatePicker(true)}
              className="cursor-pointer"
            />
          )}
          {showDatePicker && (
            <input
              type="date"
              onChange={handleDateChange}
              className="absolute inset-0 w-full h-full opacity-100 cursor-pointer"
              style={{ zIndex: 20, backgroundColor: "white" }}
              onBlur={() => setShowDatePicker(false)}
            />
          )}
        </div>
        <div className="w-1/3 relative">
          <span
             onClick={!priority ? () => setShowPriorityDropdown(!showPriorityDropdown) : null}
            className={`cursor-pointer p-2 rounded-lg ${getPriorityStyle()}`}
          >
            {priority || "Set priority"}
          </span>
          {showPriorityDropdown && (
            <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-1 w-full">
              <div
                onClick={() => handlePrioritySelect("High")}
                className="p-2 cursor-pointer hover:bg-gray-100 text-red-500"
              >
                High
              </div>
              <div
                onClick={() => handlePrioritySelect("Medium")}
                className="p-2 cursor-pointer hover:bg-gray-100 text-yellow-500"
              >
                Medium
              </div>
              <div
                onClick={() => handlePrioritySelect("Low")}
                className="p-2 cursor-pointer hover:bg-gray-100 text-green-500"
              >
                Low
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-600 mt-4 text-center">{remainingTimeText}</div>
      <TaskDrawer
        task={task}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default TaskCard;
