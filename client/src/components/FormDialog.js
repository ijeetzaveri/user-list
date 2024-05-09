import { useState, Fragment } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./FormDialog.css";
import { toast } from "react-toastify";

export default function FormDialog({ handleUserAdded }) {
  const [open, setOpen] = useState(false);

  const newUserSchema = yup.object().shape({
    firstName: yup.string().min(3).max(20).required(),
    lastName: yup.string().min(3).max(25).required(),
    phoneNo: yup
      .string()
      .length(10)
      .required()
      .matches(/^[0-9]+$/, {
        message: "Only supports numeric digits",
      }),
    email: yup.string().required().email(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(newUserSchema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => reset(), 300);
  };

  const onSubmit = async (data) => {
    await fetch("http://localhost:8080/api/user", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (result) => {
        const data = await result.json();
        if (!data.status) return toast.error(data.error);

        handleUserAdded(true);
        handleClose();
        return toast.success(data.message);
      })
      .catch((error) => toast.error(error));
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        className="button-alignment"
      >
        + Create New User
      </Button>
      <Dialog open={open} margin="none" onClose={handleClose}>
        <DialogTitle>Create New User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ paddingTop: 0 }}>
            <TextField
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
              {...register("firstName")}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
              {...register("lastName")}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
            <TextField
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              {...register("email")}
            />
            {errors.email && <p>{errors.email.message}</p>}
            <TextField
              margin="dense"
              label="Phone No."
              type="text"
              fullWidth
              variant="standard"
              {...register("phoneNo")}
            />
            {errors.phoneNo && <p>{errors.phoneNo.message}</p>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
