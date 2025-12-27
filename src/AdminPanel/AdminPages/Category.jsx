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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export default function Category() {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [attrValue, setAttrValue] = useState([]);
  const [catImg, setCatImage] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  const getCategories = async () => {
    setLoading(true);
    let response = await getData("categories?page=" + page);
    if (response.status === 200) {
      setCategories(response.data.data);
      setTotalPages(response.data.data.last_page);
    } else {
      setCategories([]);
    }
    setLoading(false);
  };

  const getAttributes = async () => {
    let response = await getData('attributes');
    if (response.status === 200) {
      setAttributes(response.data.data);
    } else {
      setAttributes([]);
    }
  }

  const handleAttributeChange = (event) => {
    const {
      target: { value },
    } = event;
    setAttrValue(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    getCategories();
    getAttributes();
  }, [page]);

  const handleClickOpen = async (id, modal) => {
    // Reset form when opening any modal
    setCategoryName("");
    setCategoryDescription("");
    setAttrValue([]);

    if (modal === "create") {
      setModalType("create");
    } else if (modal === "update") {
      let response = await getData(`categories/${id}`);
      if (response.status === 200) {
        const category = response.data;
        setCategoryName(category.name);
        setCategoryDescription(category.description);
        setCatImage(category.image_url);
        setPreviewImg(category.image_url);

        // Pre-select existing attributes for update
        if (category.attributes && category.attributes.length > 0) {
          const existingAttributeIds = category.attributes.map(attr => attr.id);
          setAttrValue(existingAttributeIds);
        }

        setModalType("update");
      }

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
    // Reset form when closing modal
    setCategoryName("");
    setCategoryDescription("");
    setAttrValue([]);
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
    formdata.append('attribute_ids', JSON.stringify(attrValue));
    formdata.append('image', catImg);

    let response = await postData("categories", formdata);

    if (response.status == 200) {
      getCategories();
      handleClose();
      toast.success("Category created successfully");
    } else {
      toast.error("Error creating category: " + response.error);
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
    formdata.append('attribute_ids', JSON.stringify(attrValue));
    formdata.append('image', catImg);

    let response = await postData(`categories/${requiredID}`, formdata);
    if (response.status == 200) {
      getCategories();
      handleClose();
      toast.success("Category updated successfully");
    } else {
      toast.error("Error updating category: " + response.error);
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {modalType === "create" && (
          <div>
            <h1 className="text-xl font-bold text-center py-5">
              Create New Category
            </h1>
            <DialogContent>
              <DialogContentText>
                To create a new category, please enter the category details below.
              </DialogContentText>
              <form onSubmit={handleSubmit}>
                <input
                  onChange={(e) => setCategoryName(e.target.value)}
                  value={categoryName}
                  type="text"
                  className="w-full py-3 px-4 mt-4 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Name"
                  required
                />

                <input
                  onChange={(e) => {
                    setCatImage(e.target.files[0]);
                    setPreviewImg(URL.createObjectURL(e.target.files[0]));
                  }}
                  type="file"
                  className="w-full py-3 px-4 mt-4 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Image"
                  required
                />

                {previewImg && <img src={previewImg} alt="Preview" className="h-32 w-32 object-cover mt-2 mb-2" />}

                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                  <InputLabel id="create-attributes-label">Attributes</InputLabel>
                  <Select
                    labelId="create-attributes-label"
                    multiple
                    value={attrValue}
                    onChange={handleAttributeChange}
                    input={<OutlinedInput label="Attributes" />}
                    renderValue={(selected) =>
                      selected.map(id => attributes.find(a => a.id === id)?.name).join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    {attributes.map((attribute) => (
                      <MenuItem key={attribute.id} value={attribute.id}>
                        <Checkbox checked={attrValue.includes(attribute.id)} />
                        <ListItemText primary={attribute.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <textarea
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  value={categoryDescription}
                  rows={3}
                  className="w-full py-3 px-4 mt-2 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Description"
                  required
                />
                <div className="text-center mt-5">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Create Category
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
          <div>
            <h1 className="text-xl font-bold text-center py-5">
              Update Category
            </h1>
            <DialogContent>
              <DialogContentText>
                Update the category details below.
              </DialogContentText>
              <form onSubmit={handleEdit}>
                <input
                  onChange={(e) => setCategoryName(e.target.value)}
                  value={categoryName}
                  type="text"
                  className="w-full py-3 px-4 mt-4 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Name"
                  required
                />

                <input
                  onChange={(e) => {
                    setCatImage(e.target.files[0]);
                    setPreviewImg(URL.createObjectURL(e.target.files[0]));
                  }}
                  type="file"
                  className="w-full py-3 px-4 mt-4 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Image"
                  required
                />

                {previewImg && <img src={previewImg} alt="Preview" className="h-32 w-32 object-cover mt-2 mb-2" />}


                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                  <InputLabel id="update-attributes-label">Attributes</InputLabel>
                  <Select
                    labelId="update-attributes-label"
                    multiple
                    value={attrValue}
                    onChange={handleAttributeChange}
                    input={<OutlinedInput label="Attributes" />}
                    renderValue={(selected) =>
                      selected.map(id => attributes.find(a => a.id === id)?.name).join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    {attributes.map((attribute) => (
                      <MenuItem key={attribute.id} value={attribute.id}>
                        <Checkbox checked={attrValue.includes(attribute.id)} />
                        <ListItemText primary={attribute.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <textarea
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  value={categoryDescription}
                  rows={3}
                  className="w-full py-3 px-4 mt-2 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Category Description"
                  required
                />
                <div className="text-center mt-5">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Update Category
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
            <DialogTitle id="alert-dialog-title">
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this category? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleDelete} color="error" autoFocus>
                Delete
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
                  <h1 className="text-sm font-semibold">Category Img</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Category Name</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">
                    Category Description
                  </h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Attributes</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Action</h1>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell align="center">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-40 h-40 object-cover rounded-t-lg"
                      />
                    </TableCell>
                    <TableCell align="center">{category.name}</TableCell>
                    <TableCell align="center">
                      {category.description || "No description available"}
                    </TableCell>
                    <TableCell align="center">
                      {category.attributes && category.attributes.length > 0
                        ? category.attributes.map(attr => attr.name).join(', ')
                        : "No attributes"
                      }
                    </TableCell>
                    <TableCell align="center">
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
      <div className='flex justify-center'>
        <Stack spacing={2} className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Stack>
      </div>
    </div>
  );
}