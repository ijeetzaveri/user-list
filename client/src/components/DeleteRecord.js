import { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const deleteData = async (_id) => {
  const apiUrl = `http://localhost:8080/api/user/${_id}`;

  try {
    const response = await fetch(apiUrl, { method: "DELETE" });
    const result = await response.json();
    if (!result.status) return toast.error(result.error);

    toast.success(result.message);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return toast.error(error);
  }
};
export default function DeleteRecord({ userId, deleteHandler }) {
  const [open, setOpen] = useState(false);

  const handleDeleteConfirmation = async () => {
    await deleteData(userId);
    deleteHandler();
    // Close the delete confirmation dialog
    setOpen(false);
  };

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this record?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirmation} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
