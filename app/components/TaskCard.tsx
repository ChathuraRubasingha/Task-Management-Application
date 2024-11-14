import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../features/tasks/taskSlice";
import "../styles/TaskCard.css";
import User from "../assets/Images/profile img.png";
import User2 from "../assets/Images/profile img (1).png";
import Avetar from "../assets/icons/user.svg";
import CalendarIcon from "../assets/icons/date.svg";
import Image from "next/image";
import { format } from "date-fns";
import TaskDrawer from "./TaskDrawer";

const assignees = [
  { name: "John Doe", image: User },
  { name: "Jane Smith", image: User2 },
  { name: "Sam Wilson", image: User },
];

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "");
  const [selectedAssignee, setSelectedAssignee] = useState(
    task.assignee || null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    const formattedDate = format(selectedDate, "dd MMM");
    setDueDate(formattedDate);
    handleFieldChange("dueDate", formattedDate);
    setShowDatePicker(false);
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

  return (
    <div className="border rounded-lg p-4 bg-gray-50 shadow-sm w-full max-w-md mb-3" >
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
          className="w-full p-2 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-500 border-none"
        />
      </div>
      <div className="flex items-center space-x-3 mt-2">
        <div className="w-1/3 relative">
          {selectedAssignee ? (
            <Image
              src={selectedAssignee.image}
              width={40}
              height={40}
              alt="Picture of the author"
              onClick={() => setShowDropdown(true)}
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
              onClick={() => setShowDatePicker(true)}
              className="cursor-pointer text-gray-700"
            >
              {dueDate}
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
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
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
      <TaskDrawer task={task} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}

export default TaskCard;
