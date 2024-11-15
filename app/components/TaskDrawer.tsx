import { Drawer, IconButton, TextField, MenuItem, Button, Dialog, DialogActions, DialogTitle } from "@mui/material"; 
import CloseIcon from "../assets/icons/date.svg";
import TrashIcon from "../assets/icons/user.svg";
import ClearIcon from "../assets/icons/tick-circle.svg"; // Import an X icon from Material UI
import Image from "next/image";
import { useDispatch } from "react-redux";
import { removeTask, updateTask } from "../features/tasks/taskSlice";
import { useState, useEffect } from "react";
import { assignees } from "./TaskCard";

export default function TaskDrawer({ task, open, onClose }) {
    const dispatch = useDispatch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Local state for fields
    const [title, setTitle] = useState(task.title || "");
    const [status, setStatus] = useState(task.status || "");
    const [dueDate, setDueDate] = useState(task.dueDate || "");
    const [assignee, setAssignee] = useState(task.assignee || null);
    const [priority, setPriority] = useState(task.priority || "Medium");
    const [description, setDescription] = useState(task.description || "");

    // Sync local state with task prop when it changes
    useEffect(() => {
        setTitle(task.title || "");
        setStatus(task.status || "");
        setDueDate(task.dueDate || "");
        setAssignee(task.assignee || null);
        setPriority(task.priority || "Medium");
        setDescription(task.description || "");
    }, [task]);

    // Save changes on modal close
    const handleSaveChanges = () => {
        dispatch(updateTask({ id: task.id, field: "title", value: title }));
        dispatch(updateTask({ id: task.id, field: "status", value: status }));
        dispatch(updateTask({ id: task.id, field: "dueDate", value: dueDate }));
        dispatch(updateTask({ id: task.id, field: "assignee", value: assignee }));
        dispatch(updateTask({ id: task.id, field: "priority", value: priority }));
        dispatch(updateTask({ id: task.id, field: "description", value: description }));
        onClose();
    };

    const handleDelete = () => {
        dispatch(removeTask({ id: task.id }));
        setDeleteDialogOpen(false);
        onClose();
    };

    // Mark the task as completed
    const handleMarkComplete = () => {
        if (status !== "completed") {
            setStatus("completed");
            dispatch(updateTask({ id: task.id, field: "status", value: "completed" }));
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={handleSaveChanges}>
            <div style={{ width: 350, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                        variant="outlined"
                        onClick={handleMarkComplete}
                        style={{
                            backgroundColor: status === "completed" ? "green" : "",
                            color: status === "completed" ? "white" : "inherit",
                        }}
                    >
                        Mark Complete
                    </Button>
                    <IconButton onClick={handleSaveChanges}>
                        <Image src={CloseIcon} width={24} height={24} alt="close button" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteDialogOpen(true)}>
                        <Image src={TrashIcon} width={24} height={24} alt="delete button" />
                    </IconButton>
                </div>

                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Status"
                    select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="inProgress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                </TextField>

                {/* Due Date with Clear Icon */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <IconButton onClick={() => setDueDate("")}>
                        <Image src={ClearIcon} width={24} height={24} alt="clear due date" />
                    </IconButton>
                </div>

                {/* Assignee Dropdown with Images and Names and Clear Icon */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label="Assignee"
                        select
                        value={assignee?.name || ""}
                        onChange={(e) => {
                            const selectedAssignee = assignees.find(a => a.name === e.target.value);
                            setAssignee(selectedAssignee);
                        }}
                        fullWidth
                        margin="normal"
                    >
                        {assignees.map((assignee) => (
                            <MenuItem key={assignee.name} value={assignee.name}>
                                <div className="flex items-center">
                                    <Image
                                        src={assignee.image}
                                        width={30}
                                        height={30}
                                        alt="assignee avatar"
                                        className="rounded-full mr-2"
                                    />
                                    <span>{assignee.name}</span>
                                </div>
                            </MenuItem>
                        ))}
                    </TextField>
                    <IconButton onClick={() => setAssignee(null)}>
                        <Image src={ClearIcon} width={24} height={24} alt="clear assignee" />
                    </IconButton>
                </div>

                {/* Priority Dropdown with Clear Icon */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label="Priority"
                        select
                        value={priority || ""}
                        onChange={(e) => setPriority(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                    </TextField>
                    <IconButton onClick={() => setPriority("")}>
                        <Image src={ClearIcon} width={24} height={24} alt="clear priority" />
                    </IconButton>
                </div>

                <TextField
                    label="Description"
                    multiline
                    minRows={3}
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Drawer>
    );
}
