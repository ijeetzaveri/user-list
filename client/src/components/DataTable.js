import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Menu,
  Button,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import EditFormDialog from "./EditFormDialog";
import DeleteRecord from "./DeleteRecord";
import StatusUpdate from "./StatusUpdate";
import { toast } from "react-toastify";

const columns = [
  { id: "firstName", label: "First Name", minWidth: 200 },
  { id: "lastName", label: "Last Name", minWidth: 200 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "phoneNo", label: "Phone No", minWidth: 200 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "action", label: "Action", minWidth: 100 },
];

const rowsPerPageOptions = [2, 5, 10, 25, 50];

const DataTable = ({ isUserAdded, handleUserAdded }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedField, setSelectedField] = useState(columns[0].id);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkOperation, setBulkOperation] = useState(null);

  const fetchData = async (page, rowsPerPage, selectedField, searchValue) => {
    let apiUrl = `http://localhost:8080/api/user?page=${page}&limit=${rowsPerPage}`;
    if (searchValue !== "") {
      apiUrl += `&field=${selectedField}&search=${searchValue}`;
    }

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      if (!result.status) return toast.error(result.error);

      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchData(page + 1, rowsPerPage, selectedField, searchValue)
      .then((result) => {
        setData(result.data.users);
        setTotalItems(result.data.total);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return toast.error(error);
      });
  }, [page, rowsPerPage, selectedField, searchValue]);

  const handleChangePage = (event, newPage) => {
    setSelectedRows([]);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const dataChangeHandler = async () => {
    try {
      const result = await fetchData(
        page + 1,
        rowsPerPage,
        selectedField,
        searchValue
      );
      setData(result.data.users);
      setTotalItems(result.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      return toast.error(error);
    }
  };

  if (isUserAdded) {
    dataChangeHandler();
    handleUserAdded(false);
  }

  const toggleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleConfirmation = async () => {
    setDialogOpen(false);
    const data = JSON.stringify({
      ids: selectedRows,
    });

    let apiUrl = `http://localhost:8080/api/user/bulkUpdate?`;

    if (bulkOperation === "delete") apiUrl += `isDeleted=true`;
    else {
      apiUrl += `status=${bulkOperation}`;
    }

    try {
      await fetch(apiUrl, {
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (result) => {
        const data = await result.json();
        if (data.error) return toast.error(data.error?.length ? [...data.error] : data.error);

        toast.success(data.message);
        setSelectedRows([]);
        return dataChangeHandler();
      });
    } catch (error) {
      return toast.error(error);
    }
  };

  const handleClickDialogOpen = async () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectRow = () => {
    const allSelected = selectedRows.length === data.length;
    setSelectedRows(allSelected ? [] : data.map((row) => row._id));
  };

  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (option) => {
    setBulkOperation(option);

    if (selectedRows.length) handleClickDialogOpen();
    handleActionClose();
  };

  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, margin: "30px" }}>
        <TextField
          select
          label="Select Field"
          value={selectedField}
          onChange={handleFieldChange}
          style={{ marginRight: "16px" }}
        >
          <MenuItem key="firstName" value="firstName">
            First Name
          </MenuItem>
          <MenuItem key="lastName" value="lastName">
            Last Name
          </MenuItem>
          <MenuItem key="email" value="email">
            Email
          </MenuItem>
          <MenuItem key="phoneNo" value="phoneNo">
            Phone No
          </MenuItem>
        </TextField>
        <TextField
          label="Search"
          value={searchValue}
          onChange={handleSearchChange}
          style={{ marginBottom: "16px" }}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </div>
      <Paper style={{ margin: "100px 16px", padding: "16px" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < data.length
                    }
                    checked={data.length && selectedRows.length === data.length}
                    onChange={handleSelectRow}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                    {column.id === "action" && (
                      <>
                        <IconButton onClick={handleActionClick}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleActionClose}
                        >
                          <MenuItem
                            onClick={() => handleActionSelect("active")}
                          >
                            Active
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect("inactive")}
                          >
                            Inactive
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleActionSelect("delete")}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    style={{ textAlign: "center" }}
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row._id)}
                        onChange={() => toggleRowSelection(row._id)}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      if (column.id === "status") {
                        return (
                          <TableCell key={column.id}>
                            <StatusUpdate
                              userId={row._id}
                              status={row[column.id]}
                              editHandler={dataChangeHandler}
                            />
                          </TableCell>
                        );
                      } else if (column.id !== "action") {
                        return (
                          <TableCell key={column.id}>
                            {row[column.id]}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={column.id}>
                            <EditFormDialog
                              user={row}
                              editHandler={dataChangeHandler}
                            />
                            <DeleteRecord
                              userId={row._id}
                              deleteHandler={dataChangeHandler}
                            />
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={({ onPageChange, page }) => (
            <div style={{ display: "flex" }}>
              <IconButton
                onClick={() => onPageChange(null, page - 1)}
                disabled={page === 0}
                aria-label="previous page"
              >
                <KeyboardArrowLeft />
              </IconButton>
              <IconButton
                onClick={() => onPageChange(null, page + 1)}
                disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}
                aria-label="next page"
              >
                <KeyboardArrowRight />
              </IconButton>
            </div>
          )}
        />
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Update users</DialogTitle>
        <DialogContent>
          Are you sure you want to update these selected records?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error">
            No
          </Button>
          <Button onClick={handleConfirmation} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataTable;
