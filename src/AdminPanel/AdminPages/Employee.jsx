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

export default function Employee() { // Fixed component name to start with capital
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEmployees = async () => {
    setLoading(true);
    let response = await getData("employees?page=" + page); // Added pagination
    if (response.status === 200) {
      setEmployees(response.data.data);
      setTotalPages(response.data.meta?.last_page || response.data.last_page || 1);
    } else {
      setEmployees([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEmployees();
  }, [page]); // Added page dependency

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
    try {
      let response = await deleteData(`employees/${requiredID}`);
      if (response.status === 200) {
        toast.success("Employee deleted successfully");
        getEmployees();
        handleClose();
      } else {
        toast.error("Error deleting employee: " + response.message);
      }
    } catch (error) {
      toast.error("Error deleting employee");
    }
  };

  const handleBanToggle = async (employeeId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append("is_ban", !currentStatus);

      let response = await postData(`employees/${employeeId}/ban`, formData);
      if (response.status === 200) {
        toast.success(`Employee ${!currentStatus ? 'banned' : 'unbanned'} successfully`);
        getEmployees();
      } else {
        toast.error("Error updating employee status");
      }
    } catch (error) {
      toast.error("Error updating employee status");
    }
  };

  const handleVerifyToggle = async (employeeId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append("is_verified", !currentStatus);

      let response = await postData(`employees/${employeeId}/verify`, formData);
      if (response.status === 200) {
        toast.success(`Employee ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        getEmployees();
      } else {
        toast.error("Error updating employee verification status");
      }
    } catch (error) {
      toast.error("Error updating employee verification status");
    }
  };

  return (
    <div>
      <div
        className="flex justify-between mx-10 my-5"
        title="Create New Employee"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        {modalType === "delete" && (
          <div>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this employee? This action cannot be undone.
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
          <Table aria-label="employees table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Image</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Name</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Email</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Phone</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Role</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Date of Birth</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Gender</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Verified</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Status</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 className="text-sm font-semibold">Actions</h1>
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
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    {/* Image */}
                    <TableCell align="center">
                      <div className='flex justify-center items-center'>
                        <img
                          className='w-12 h-12 rounded-full object-cover'
                          src={employee.image_url || '/default-avatar.png'}
                          alt={employee.name}
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell align="center">
                      {employee.name}
                    </TableCell>

                    {/* Email */}
                    <TableCell align="center">
                      {employee.email}
                    </TableCell>

                    {/* Phone - Updated field name */}
                    <TableCell align="center">
                      {employee.phone_number || "N/A"}
                    </TableCell>

                    {/* Role */}
                    <TableCell align="center">
                      {employee.role?.name || "N/A"}
                    </TableCell>

                    {/* Date of Birth - Updated field name */}
                    <TableCell align="center">
                      {employee.dob || "N/A"}
                    </TableCell>

                    {/* Gender */}
                    <TableCell align="center">
                      {employee.gender ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1) : "N/A"}
                    </TableCell>

                    {/* Verification Status with Toggle */}
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color={employee.is_verified ? "success" : "warning"}
                        onClick={() => handleVerifyToggle(employee.id, employee.is_verified)}
                      >
                        {employee.is_verified ? "Verified" : "Unverified"}
                      </Button>
                    </TableCell>

                    {/* Ban Status with Toggle */}
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color={employee.is_ban ? "error" : "success"}
                        onClick={() => handleBanToggle(employee.id, employee.is_ban)}
                      >
                        {employee.is_ban ? "Banned" : "Active"}
                      </Button>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <ModeEditOutlineOutlinedIcon
                        onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-6'>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
            />
          </Stack>
        </div>
      )}
    </div>
  );
}