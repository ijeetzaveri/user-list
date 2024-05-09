import { useState, Fragment } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./EditFormDialog.css";
import { toast } from "react-toastify";

const getUserData = async (_id) => {
  const apiUrl = `http://localhost:8080/api/user/${_id}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    if (!result.status) return toast.error(result.error);

    toast.success(result.message);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return toast.error(error);
  }
};
export default function EditFormDialog({ user, editHandler }) {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});

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
    setValue,
  } = useForm({
    resolver: yupResolver(newUserSchema),
  });

  const handleClickOpen = async () => {
    const getUser = await getUserData(user._id);
    setUserData(getUser.data);
    setValue("firstName", getUser.data.firstName);
    setValue("lastName", getUser.data.lastName);
    setValue("email", getUser.data.email);
    setValue("phoneNo", getUser.data.phoneNo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => reset(), 300);
  };

  const onSubmit = async (data) => {
    try {
      await fetch(`http://localhost:8080/api/user/${userData._id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (result) => {
          const data = await result.json();
          if (!data.status) return toast.error(data.error);

          handleClose();
          editHandler();
          return toast.success(data.message);
        })
        .catch((error) => toast.error(error));
    } catch (error) {
      return toast.error(error);
    }
  };

  return (
    <Fragment>
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} margin="none" onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
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
            <Button type="submit">Edit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
