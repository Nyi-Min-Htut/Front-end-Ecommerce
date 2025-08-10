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
import { getData, postData } from "../../axios/axios";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Category() {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const getCategories = async ()=>{
    let response = await getData('categories');
    console.log(response);
    if(response.status === 200){
      setCategories(response.data);
    }
  }

  useEffect(()=>{
    getCategories();

  },[]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async(event) => {

    if (!categoryName || !categoryDescription) {
      alert("Please fill in all fields");
      return;
    }

    event.preventDefault();
    let formdata = new FormData();
    formdata.append('name',categoryName);
    formdata.append('description',categoryDescription);


    let response = await postData('categories',formdata)
    console.log(response);
    handleClose();
  };

  return (
    <div>
      {name}
      <div
        className="flex justify-between mx-10 my-5"
        title="Create New Customer"
      >
        <h1 className="text-xl font-bold">Customer List</h1>
        <AddBoxIcon fontSize="large" onClick={handleClickOpen} className="cursor-pointer text-blue-400 hover:text-blue-600" />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className=' '>
         <h1 className='text-xl font-bold text-center py-5'>Create New Category</h1>
          <DialogContent>
            <DialogContentText>
              To create a new category, please enter the category name here.
            </DialogContentText>
            <form onSubmit={handleSubmit}>
              <input 
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
                type="text" 
                className='w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2' 
                placeholder='Category Name' 
              />

              <input 
                onChange={(e) => setCategoryDescription(e.target.value)}
                value={categoryDescription}
                type="text" 
                className='w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2' 
                placeholder='Category Description' 
              />
              <div className='text-center mt-5 '>
                <Button type="submit" fullWidth variant="contained" color="primary">
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
      </Dialog>

      <div className="mt-10">
       <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>
                <h1 className='text-md font-bold'>Category Name</h1>
              </TableCell>
              <TableCell>
                <h1 className='text-md font-bold'>Category Description</h1>
                
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
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
