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


export default function Category() {
  const [open, setOpen] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    let response = await getData("categories");
    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleClickOpen = async (id, modal) => {
  
    if (modal == "create") {
      setModalType("create");
    } else if (modal == "update") {

      let response = await getData(`categories/${id}`);
      setCategoryName(response.data.name);
      setCategoryDescription(response.data.description);
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

    if (!categoryName || !categoryDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", categoryName);
    formdata.append("description", categoryDescription);

    let response = await postData("categories", formdata);

    if (response.status == 200) {
      setCategoryName("");
      setCategoryDescription("");
      getCategories();
      handleClose();
      toast.success("Category created successfully");
    } else {
      alert("Error creating category: " + response.error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    let formdata = new FormData();
    formdata.append("name", categoryName);
    formdata.append("description", categoryDescription);
    let response = await postData(`categories/${requiredID}`, formdata);
    if (response.status == 200) {
      setCategoryName("");
      setCategoryDescription("");
      getCategories();
      handleClose();
      toast.success("Category updated successfully");
    } else {
      alert("Error updating category: " + response.error);
    }
  };

  const handleDelete = async () => {
    let response = await deleteData(`categories/${requiredID}`);
    if (response.status === 200) {
      toast.success("Category deleted successfully");
      getCategories();
      handleClose();
    } else {
      toast.error("Error deleting category: " + response.error);
    }
  };

  return (
    <div>
      {name}
      <div
        className="flex justify-between mx-10 my-5"
        title="Create New Category List"
      >
        <h1 className="text-xl font-bold">Category List</h1>
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
        {modalType==='create' && (
          <div className=" ">
            <h1 className="text-xl font-bold text-center py-5">
              Create New Category
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new category, please enter the category name here.
              </DialogContentText>
              <form onSubmit={handleSubmit}>
                <input
                  onChange={(e) => setCategoryName(e.target.value)}
                  value={categoryName}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Name"
                />

                <input
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  value={categoryDescription}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Description"
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

        {modalType==='update' && (
          <div className=" ">
            <h1 className="text-xl font-bold text-center py-5">
              Update Category
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new category, please enter the category name here.
              </DialogContentText>
              <form onSubmit={handleEdit}>
                <input
                  onChange={(e) => setCategoryName(e.target.value)}
                  value={categoryName}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Name"
                />

                <input
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  value={categoryDescription}
                  type="text"
                  className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Description"
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

        {modalType==='delete' && (
          <div>
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this category? This action
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
          <Table aria-label="categories table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Category Name</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">
                    Category Description
                  </h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Action</h1>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 1 }}>
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      sx={{ px: 1, py: 1.5 }}
                    >
                      {category.name}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {category.description || "No description available"}
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      <ModeEditOutlineOutlinedIcon
                        onClick={() => handleClickOpen(category.id, "update")}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                      />
                      <DeleteOutlineOutlinedIcon
                        onClick={() => handleClickOpen(category.id, "delete")}
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
    </div>
  );
}
