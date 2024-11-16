import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../features/tasks/taskSlice";
import { format, differenceInDays, isToday } from "date-fns";
import "../styles/TaskCard.css";
import Use from "../assets/Images/profile img.png";
import User2 from "../assets/Images/profile img (1).png";
import Avetar from "../assets/icons/user.svg";
import CalendarIcon from "../assets/icons/date.svg";
import Image from "next/image";
import TaskDrawer from "./TaskDrawer";
import { Clock, TickCircle } from "iconsax-react";

export const assignees = [
  { name: "John Doe", image: Use },
  { name: "Jane Smith", image: User2 },
  { name: "Sam Wilson", image: Use },
];

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate) : null
  );
  const [priority, setPriority] = useState(task.priority || "");
  const [selectedAssignee, setSelectedAssignee] = useState(
    task.assignee || null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [remainingTimeText, setRemainingTimeText] = useState("");
  const [islate, setIsLate] = useState(false);

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
    handleFieldChange("dueDate", selectedDate.toISOString());
    setShowDatePicker(false);

    updateRemainingTimeText(selectedDate);
  };

  const getPriorityStyle = () => {
    switch (task.priority) {
      case "High":
        return "text-red-500 bg-red-50 border-none";
      case "Medium":
        return "text-yellow-500 bg-yellow-50 border-none";
      case "Low":
        return "text-green-500 bg-green-50 border-none";
      default:
        return "text-gray-500 bg-gray-50";
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
    if (daysDifference > -1) {
      setIsLate(true);
    }

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
    <div className=" card-wrapper border shadow-sm w-full max-w-md mb-3 ">
      <div
        onClick={() => setIsDrawerOpen(true)}
        style={{ height: "30px", width: "100%", position: "absolute" }}
      ></div>
      <div className="card-upper">
        <div className="card-title mb-2">
          <TickCircle
            size={24}
            variant={task.status === "completed" ? "Bold" : "Outline"}
            color={task.status === "completed" ? "#2A7E2E" : "#727272"}
          />
          <input
            type="text"
            value={task.title}
            placeholder="Write a task name"
            onChange={(e) => {
              setTitle(e.target.value);
              handleFieldChange("title", e.target.value);
            }}
            disabled={!!title && !!dueDate && !!priority}
            className="card-title-text w-full p-2 rounded-lg placeholder-gray-500 border-none"
          />
        </div>
      </div>
      <div className="card-lower">
        {task.description && (
          <div className="card-description">
            {task.description && task.description.length > 75
              ? `${task.description.substring(0, 75)}...`
              : task.description}
          </div>
        )}

        <div className="card-buttons-wrapper">
          <div className="card-button-left">
            <div className="asignee">
              {selectedAssignee ? (
                <Image src={selectedAssignee.image} width={40} height={40} />
              ) : (
                <Image
                  src={Avetar}
                  width={40}
                  height={40}
                  onClick={() => setShowDropdown(true)}
                />
              )}
              {showDropdown && (
                <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-2 max-h-48 overflow-y-auto">
                  {assignees.map((assignee) => (
                    <div
                      key={assignee.name}
                      onClick={() => handleAssigneeChange(assignee)}
                      className="assignee-menu hover:bg-gray-100"
                    >
                      <Image src={assignee.image} width={40} height={40} />
                      <span>{assignee.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="due-date relative">
              {task.dueDate ? (
                <span
                  style={
                    task.status === "completed"
                      ? { color: "#727272", backgroundColor: "transparent" }
                      : islate
                      ? { color: "blue", backgroundColor: "#e9f1ff" }
                      : { color: "red", backgroundColor: "#ffeaeaec" }
                  }
                >
                  {format(task.dueDate, "MMM dd")}
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
                  style={{
                    zIndex: 20,
                    backgroundColor: "white",
                    width: "100px",
                    color: "gray",
                  }}
                  onBlur={() => setShowDatePicker(false)}
                />
              )}
            </div>
          </div>
          <div className="card-button-right">
            <div className="priority">
              <span
                onClick={
                  !priority
                    ? () => setShowPriorityDropdown(!showPriorityDropdown)
                    : null
                }
                className={`cursor-pointer p-2 rounded-lg ${getPriorityStyle()}`}
              >
                {task.priority || "Set priority"}
              </span>
              {showPriorityDropdown && (
                <div className="priority-menu absolute z-10 bg-white border rounded-lg shadow-lg mt-1 text-left">
                  <div
                    onClick={() => handlePrioritySelect("Low")}
                    className="priority-menu-item p-2 cursor-pointer hover:bg-gray-100"
                  >
                    Low
                  </div>
                  <div
                    onClick={() => handlePrioritySelect("Medium")}
                    className="priority-menu-item p-2 cursor-pointer hover:bg-gray-100 "
                  >
                    Medium
                  </div>
                  <div
                    onClick={() => handlePrioritySelect("High")}
                    className="priority-menu-item p-2 cursor-pointer hover:bg-gray-100"
                  >
                    High
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {remainingTimeText && (
        <div className="card-fotter">
          <Clock style={{ marginRight: "10px" }} size={20} color="#727272" />
          <div>{remainingTimeText}</div>
        </div>
      )}

      <TaskDrawer
        task={task}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default TaskCard;
