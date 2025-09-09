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
import { Pagination, Stack } from "@mui/material";

export default function attribute() {
  const [open, setOpen] = useState(false);
  const [attributeName, setattributeName] = useState("");
  const [attributeDescription, setattributeDescription] = useState("");
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [name, setName] = useState("");
  const [attributes, setattributes] = useState([]);
  const [loading, setLoading] = useState(true); // initially loading
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getattributes = async () => {
    setLoading(true); // start loading
    let response = await getData("attributes");
    if (response.status === 200) {
      setattributes(response.data.data);
      setTotalPages(response.data.data.last_page);

    } else {
      setattributes([]); // handle error by emptying array
    }
    setLoading(false); // done loading
  };

  useEffect(() => {
    getattributes();
  }, []);

  const handleClickOpen = async (id, modal) => {
    if (modal == "create") {
      setModalType("create");
    } else if (modal == "update") {
      let response = await getData(`attributes/${id}`);
      setattributeName(response.data.name);
      setattributeDescription(response.data.description);
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

    if (!attributeName || !attributeDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", attributeName);
    formdata.append("description", attributeDescription);

    let response = await postData("attributes", formdata);
    console.log(response);
    if (response.status == 200) {
      setattributeName("");
      setattributeDescription("");
      getattributes();
      handleClose();
      toast.success("attribute created successfully");
    } else {
      alert("Error creating attribute: " + response.error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!attributeName || !attributeDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", attributeName);
    formdata.append("description", attributeDescription);
    let response = await postData(`attributes/${requiredID}`, formdata);
    if (response.status == 200) {
      setattributeName("");
      setattributeDescription("");
      getattributes();
      handleClose();
      toast.success("attribute updated successfully");
    } else {
      alert("Error updating attribute: " + response.error);
    }
  };

  const handleDelete = async () => {
    let response = await deleteData(`attributes/${requiredID}`);
    if (response.status === 200) {
      toast.success("attribute deleted successfully");
      getattributes();
      handleClose();
    } else {
      toast.error("Error deleting attribute: " + response.error);
    }
  };

  return (
    <div>
      {name}
      <div
        className="flex justify-between mx-10 my-5"
        title="Create New attribute List"
      >
        <h1 className="text-xl font-bold">Attributes List</h1>
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
              Create New attribute
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new attribute, please enter the attribute name here.
              </DialogContentText>
              <form onSubmit={handleSubmit}>
                <input
                  onChange={(e) => setattributeName(e.target.value)}
                  value={attributeName}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="attribute Name"
                />

                <input
                  onChange={(e) => setattributeDescription(e.target.value)}
                  value={attributeDescription}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="attribute Description"
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
              Update attribute
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new attribute, please enter the attribute name here.
              </DialogContentText>
              <form onSubmit={handleEdit}>
                <input
                  onChange={(e) => setattributeName(e.target.value)}
                  value={attributeName}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="attribute Name"
                />

                <input
                  onChange={(e) => setattributeDescription(e.target.value)}
                  value={attributeDescription}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="attribute Description"
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
                Are you sure you want to delete this attribute? This action
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
          <Table aria-label="attributes table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Attribute Name</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">
                    Attribute Description
                  </h1>
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
                    Loading attributes...
                  </TableCell>
                </TableRow>
              ) : attributes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No attributes found.
                  </TableCell>
                </TableRow>
              ) : (
                attributes.map((attribute) => (
                  <TableRow key={attribute.id} hover>
                    <TableCell align="center">{attribute.name}</TableCell>
                    <TableCell align="center">
                      {attribute.description || "No description available"}
                    </TableCell>
                    <TableCell align="center">
                      <ModeEditOutlineOutlinedIcon
                        onClick={() => handleClickOpen(attribute.id, "update")}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                      />
                      <DeleteOutlineOutlinedIcon
                        onClick={() => handleClickOpen(attribute.id, "delete")}
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
          onChange={(e, value) => (setPage(value), console.log(value))} 
        />
      </Stack>
      </div>
    </div>
  );
}
