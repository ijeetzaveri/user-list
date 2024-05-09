import { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";

const updateData = async (userId, status) => {
  const apiUrl = `http://localhost:8080/api/user/${userId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify({
        status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!result.status) return toast.error(result.error);

    toast.success(result.message);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return toast.error(error);
  }
};
export default function StatusUpdate({ userId, editHandler, status }) {
  const [open, setOpen] = useState(false);

  const handleUpdateConfirmation = async () => {
    await updateData(userId, status === "active" ? "inactive" : "active");
    editHandler();
    // Close the update confirmation dialog
    setOpen(false);
  };

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const smallButtonStyle = {
    fontSize: "0.6rem",
    padding: "3px 6px",
  };

  return (
    <Fragment>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        style={smallButtonStyle}
        color={status === "active" ? "primary" : "warning"}
      >
        {status}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Update Status</DialogTitle>
        <DialogContent>
          Are you sure you want to update status for this record?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateConfirmation} color="success">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
