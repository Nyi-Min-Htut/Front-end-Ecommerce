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
import { useNavigate } from 'react-router-dom';
import { Pagination, Stack } from "@mui/material";

export default function employee() {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setemployees] = useState([]);
  const [stockValue, setStockValue] = useState('');
  const [loading, setLoading] = useState(true); // initially loading

  const getemployees = async () => {
    setLoading(true);
    let response = await getData("employees");
    if (response.status === 200) {
      setemployees(response.data.data);
      setTotalPages(response.data.last_page);
    }
    setLoading(false);
  };

  useEffect(() => {
    getemployees();
  }, []);

  const handleClickOpen = async (id, modal) => {
    setModalType(modal);
    if (id != null) {
      setRequireID(id);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    let response = await deleteData(`employees/${requiredID}`);
    if (response.status === 200) {
      toast.success("employee deleted successfully");
      getemployees();
      handleClose();
    } else {
      toast.error("Error deleting employee: " + response.error);
    }
  };

  const StockQuantityUpdate = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("stock_quantity", stockValue);
    let response = await postData(`employees/${requiredID}`,formData);
    if (response.status === 200) {
      toast.success("Stock Quantity updated successfully");
      getemployees();
      handleClose();
      setStockValue('');
    } else {
      toast.error("Error updating Stock Quantity: " + response.error);
    }
  };
  return (
    <div>
      <div
        className="flex justify-between mx-10 my-5"
        title="Create New employee "
      >
        <h1 className="text-xl font-bold">Employee List</h1>
        <AddBoxIcon
          fontSize="large"
          onClick={() => {
            navigate('/admin/employees/create');
          }}
          className="cursor-pointer text-blue-400 hover:text-blue-600"
        />
      </div>

      {/* create/update/delete */}
      <Dialog open={open} onClose={handleClose}>
        {modalType === "delete" && (
          <div>
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this employee? This action cannot
                be undone.
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
        {modalType === "updateStock" && (
         <div className=" ">
            <h1 className="text-xl font-bold text-center py-5">
              Stock Quantity Update
            </h1>
            <DialogContent>
              <DialogContentText>
               To increase the stock quantity, please enter a positive number.
              </DialogContentText>
              <form onSubmit={StockQuantityUpdate}>
                <input
                  onChange={(e) =>setStockValue(e.target.value)}
                  value={stockValue}
                  type="number"
                  className=" w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                  placeholder="Stock Quantity Number"
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
      </Dialog>

      <div className="mt-6 flex justify-center">
        <TableContainer component={Paper}>
          <Table aria-label="employees table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Name</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Email</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Phone</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Role</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Date of Birth</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Address</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Remark</h1>
                </TableCell>

                 <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Gender</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Image</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Verify</h1>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ):
              employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 1 }}>
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow
                    
                    key={employee.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className='cursor-pointer'
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      sx={{ px: 1, py: 1.5 }}
                    >
                      {employee.name}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.email}
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.phone || "No description available"}
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.role.name }
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.dob}
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.address}
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.remark}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.gender}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      <div className='flex justify-center items-center'>
                        <img
                          className='w-12 h-12  rounded-full object-cover'
                          src={employee.image_url}
                          alt=""
                        />
                      </div>
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      {employee.is_verified ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                      <ModeEditOutlineOutlinedIcon
                        onClick={()=>navigate(`/admin/employees/${employee.id}/edit`)}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                      />
                      <DeleteOutlineOutlinedIcon
                        onClick={() => handleClickOpen(employee.id, "delete")}
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
