import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteData, getData, postData } from "../../axios/axios";
import { toast } from "react-toastify";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function role() {
  const [open, setOpen] = useState(false);
  const [roleName, setroleName] = useState("");
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [name, setName] = useState("");
  const [roles, setroles] = useState([]);
  const [loading, setLoading] = useState(true); // initially loading
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getroles = async () => {
    setLoading(true); // start loading
    let response = await getData("roles?page=" + page);
    if (response.status === 200) {
      setroles(response.data.data);
      setTotalPages(response.data.data.last_page);
    } else {
      setroles([]); // handle error by emptying array
    }
    setLoading(false); // done loading
  };

  useEffect(() => {
    getroles();
  }, [page]);

  const handleClickOpen = async (id, modal) => {
    if (modal == "create") {
      setModalType("create");
    } else if (modal == "update") {
      let response = await getData(`roles/${id}`);
      setroleName(response.data.name);
      setModalType("update");
    } else {
      setModalType("delete");
    }
    if (id != null) {
      setRequireID(id);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!roleName ) {
      toast.error("Please fill in all fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", roleName);

    let response = await postData("roles", formdata);

    if (response.status == 200) {
      setroleName("");
      getroles();
      handleClose();
      toast.success("role created successfully");
    } else {
      alert("Error creating role: " + response.error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!roleName ) {
      toast.error("Please fill in all fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", roleName);
    let response = await postData(`roles/${requiredID}`, formdata);
    if (response.status == 200) {
      setroleName("");
      getroles();
      handleClose();
      toast.success("role updated successfully");
    } else {
      alert("Error updating role: " + response.error);
    }
  };

  const handleDelete = async () => {
    let response = await deleteData(`roles/${requiredID}`);
    if (response.status === 200) {
      toast.success("role deleted successfully");
      getroles();
      handleClose();
    } else {
      toast.error("Error deleting role: " + response.error);
    }
  };

  return (
    <div>
      {name}
      <div
        className="flex justify-between mx-10 my-5"
        title="Create New role List"
      >
        <h1 className="text-xl font-bold">Role List</h1>
        <AddBoxIcon
          fontSize="large"
          onClick={() => {
            handleClickOpen(null, "create");
          }}
          className="cursor-pointer text-blue-400 hover:text-blue-600"
        />
      </div>

      {/* create/update/delete */}
      <Dialog open={open} onClose={handleClose}>
        {modalType === "create" && (
          <div className=" ">
            <h1 className="text-xl font-bold text-center py-5">
              Create New role
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new role, please enter the role name here.
              </DialogContentText>
              <form onSubmit={handleSubmit}>
                <input
                  onChange={(e) => setroleName(e.target.value)}
                  value={roleName}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="role Name"
                />

             
                <div className="text-center mt-5 ">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
        )}

        {modalType === "update" && (
          <div className=" ">
            <h1 className="text-xl font-bold text-center py-5">
              Update role
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new role, please enter the role name here.
              </DialogContentText>
              <form onSubmit={handleEdit}>
                <input
                  onChange={(e) => setroleName(e.target.value)}
                  value={roleName}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="role Name"
                />


                <div className="text-center mt-5 ">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Update
                  </Button>
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
        )}

        {modalType === "delete" && (
          <div>
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this role? This action
                cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleDelete} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </div>
        )}
      </Dialog>

      <div className="mt-6 flex justify-center">
        <TableContainer component={Paper}>
          <Table aria-label="roles table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">role Name</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Action</h1>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Loading roles...
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell align="center">{role.name}</TableCell>
                   
                    <TableCell align="center">
                      <ModeEditOutlineOutlinedIcon
                        onClick={() => handleClickOpen(role.id, "update")}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                      />
                      <DeleteOutlineOutlinedIcon
                        onClick={() => handleClickOpen(role.id, "delete")}
                        className="cursor-pointer text-red-500 hover:text-red-700 ml-2"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className='flex justify-center'>
        <Stack spacing={2} className="flex justify-center mt-6">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => (setPage(value), console.log(value))} // updates state
        />
      </Stack>
      </div>
    </div>
  );
}
