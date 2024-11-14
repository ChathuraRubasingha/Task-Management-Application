import { Drawer, IconButton, TextField, MenuItem, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import CloseIcon from "../assets/icons/date.svg";
import TrashIcon from "../assets/icons/user.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { removeTask, updateTask } from "../features/tasks/taskSlice";
import { useState } from "react";

export default function TaskDrawer({ task, open, onClose }) {
    const dispatch = useDispatch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleFieldChange = (field, value) => {
        dispatch(updateTask({ id: task.id, field, value }));
    };

    const handleDelete = () => {
        // Confirm deletion before dispatching delete action
        // Dispatch delete action here if confirmed
        dispatch(removeTask({ id: task.id }));
        setDeleteDialogOpen(false);
        onClose(); // Close the drawer after deletion
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <div style={{ width: 350, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <IconButton onClick={onClose}>
                        <Image src={CloseIcon} width={24} height={24} alt="close button" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteDialogOpen(true)}>
                        D
                        <Image src={TrashIcon} width={24} height={24} alt="delete button" />
                    </IconButton>
                </div>

                <TextField
                    label="Title"
                    value={task.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Status"
                    select
                    value={task.status}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="inProgress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                </TextField>

                <TextField
                    label="Due Date"
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Assignee"
                    value={task.assignee?.name || ""}
                    onChange={(e) => handleFieldChange("assignee", { name: e.target.value })}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Priority"
                    select
                    value={task.priority || "Medium"}
                    onChange={(e) => handleFieldChange("priority", e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                </TextField>

                <TextField
                    label="Description"
                    multiline
                    minRows={3}
                    value={task.description || ""}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
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
