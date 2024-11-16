import {
  Drawer,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Menu,
  MenuItem,
  DialogContent,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { removeTask, updateTask } from "../features/tasks/taskSlice";
import { useState, useEffect } from "react";
import { assignees } from "./TaskCard";
import "../styles/DrowerModal.css";
import {
  ArrowRight,
  Calendar,
  CloseCircle,
  Flag,
  Note,
  RecordCircle,
  TickCircle,
  Trash,
  User,
} from "iconsax-react";
import Image from "next/image";

export default function TaskDrawer({ task, open, onClose }) {
  const dispatch = useDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [status, setStatus] = useState(task.status || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [assignee, setAssignee] = useState(task.assignee || null);
  const [priority, setPriority] = useState(task.priority || "");
  const [description, setDescription] = useState(task.description || "");

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setTitle(task.title || "");
    setStatus(task.status || "");
    setDueDate(task.dueDate || "");
    setAssignee(task.assignee || null);
    setPriority(task.priority || "");
    setDescription(task.description || "");
  }, [task]);

  const handleSaveChanges = () => {
    dispatch(updateTask({ id: task.id, field: "title", value: title }));
    dispatch(updateTask({ id: task.id, field: "status", value: status }));
    dispatch(updateTask({ id: task.id, field: "dueDate", value: dueDate }));
    dispatch(updateTask({ id: task.id, field: "assignee", value: assignee }));
    dispatch(updateTask({ id: task.id, field: "priority", value: priority }));
    dispatch(
      updateTask({ id: task.id, field: "description", value: description })
    );
    onClose();
  };

  const handleDelete = () => {
    dispatch(removeTask({ id: task.id }));
    setDeleteDialogOpen(false);
    onClose();
  };

  const handleMarkComplete = () => {
    if (status !== "completed") {
      setStatus("completed");
      dispatch(
        updateTask({ id: task.id, field: "status", value: "completed" })
      );
    }
  };

  const handleAssigneeSelect = (selectedAssignee) => {
    setAssignee(selectedAssignee);
    setAnchorEl(null);
  };

  const formattedDueDate = dueDate
    ? new Date(dueDate).toISOString().split("T")[0]
    : "";

  return (
    <Drawer anchor="right" open={open} onClose={handleSaveChanges}>
      <div className="modal-container">
        <div className="modal-header-container">
          <div className="modal-header">
            <div className="modal-header-left">
              <div
                className="mark-complete-button"
                onClick={handleMarkComplete}
                style={
                  status === "completed"
                    ? {
                        color: "#2A7E2E",
                        backgroundColor: "#dbffdcc1",
                        border: "1px solid #2A7E2E",
                      }
                    : { color: "#000000", backgroundColor: "white" }
                }
              >
                <TickCircle
                  size={24}
                  style={{ marginRight: "10px" }}
                  color={status === "completed" ? "#2A7E2E" : "#000000"}
                  variant={status === "completed" ? "Bold" : "Outline"}
                />
                {status === "completed" ? "Completed" : "Mark Complete"}
              </div>
            </div>
            <div className="modal-header-right">
              <IconButton onClick={() => setDeleteDialogOpen(true)}>
                <Trash size={20} color="#727272" />
              </IconButton>
              <IconButton onClick={handleSaveChanges}>
                <ArrowRight size={20} color="#727272" />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <input
            className="modal-title"
            placeholder="Write a task name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="form-body">
            <div className="form-left">
              <div className="form-label">
                <RecordCircle
                  size={20}
                  color="#727272"
                  style={{ marginRight: "10px" }}
                />{" "}
                Status
              </div>
              <div className="form-label">
                <Calendar
                  size={20}
                  color="#727272"
                  style={{ marginRight: "10px" }}
                />{" "}
                Due Date
              </div>
              <div className="form-label">
                <User
                  size={20}
                  color="#727272"
                  style={{ marginRight: "10px" }}
                />{" "}
                Assignee
              </div>
              <div className="form-label">
                <Flag
                  size={20}
                  color="#727272"
                  style={{ marginRight: "10px" }}
                />{" "}
                Priority
              </div>
              <div className="form-label">
                <Note
                  size={20}
                  color="#727272"
                  style={{ marginRight: "10px" }}
                />{" "}
                Description
              </div>
            </div>
            <div className="form-right">
              <select
                className="r-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  className="r-input"
                  type="date"
                  value={formattedDueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <IconButton
                  onClick={() => setDueDate("")}
                  style={{ marginLeft: "5px" }}
                >
                  <CloseCircle size={20} color="#727272" />
                </IconButton>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="assignee-dropdown">
                  <div
                    className="r-input assignee-dropdown-input"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    {assignee ? (
                      <div className="flex items-center">
                        <Image
                          src={assignee.image}
                          width={20}
                          height={20}
                          alt="assignee avatar"
                        />
                        <span className="ml-2">{assignee.name}</span>
                      </div>
                    ) : (
                      "Select Assignee"
                    )}
                  </div>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    {assignees.map((assignee) => (
                      <MenuItem
                        key={assignee.name}
                        onClick={() => handleAssigneeSelect(assignee)}
                      >
                        <div className="flex items-center">
                          <Image
                            src={assignee.image}
                            width={30}
                            height={30}
                            alt="assignee avatar"
                          />
                          <span className="ml-2">{assignee.name}</span>
                        </div>
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
                <IconButton
                  onClick={() => setAssignee(null)}
                  style={{ marginLeft: "5px" }}
                >
                  <CloseCircle size={20} color="#727272" />
                </IconButton>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <select
                  className="r-input"
                  value={priority || ""}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="" disabled>
                    Set priority
                  </option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <IconButton
                  onClick={() => setPriority("")}
                  style={{ marginLeft: "5px" }}
                >
                  <CloseCircle size={20} color="#727272" />
                </IconButton>
              </div>
            </div>
          </div>

          <textarea
            className="descprition"
            placeholder="What is this task about?"
            rows={5}
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Dialog
          className="delete-p"
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>
            Are you sure you want to delete selected task?
          </DialogTitle>
          <DialogContent>
            This will permanently delete the selected task. These items will no
            longer be accessible to you. This action is irreversible.
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              style={{
                padding: "10px",
                backgroundColor: "#f5f5f5",
                color: "black",
                borderRadius: "5px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              style={{
                padding: "10px",
                backgroundColor: "#CB2E27",
                color: "white",
                borderRadius: "5px",
              }}
            >
              Yes, delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Drawer>
  );
}
