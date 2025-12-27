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
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function product() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [requiredID, setRequireID] = useState(null);
  const [modalType, setModalType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setproducts] = useState([]);
  const [stockValue, setStockValue] = useState('');
  const [loading, setLoading] = useState(true); // initially loading

  const getproducts = async () => {
    setLoading(true);
    let response = await getData("products");
    if (response.status === 200) {
      setproducts(response.data.data);
      setTotalPages(response.data.last_page);
    }
    setLoading(false);
  };

  useEffect(() => {
    getproducts();
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
    let response = await deleteData(`products/${requiredID}`);
    if (response.status === 200) {
      toast.success("product deleted successfully");
      getproducts();
      handleClose();
    } else {
      toast.error("Error deleting product: " + response.error);
    }
  };

  const StockQuantityUpdate = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("stock_quantity", stockValue);
    let response = await postData(`products/${requiredID}`, formData);
    if (response.status === 200) {
      toast.success("Stock Quantity updated successfully");
      getproducts();
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
        title="Create New product "
      >
        <h1 className="text-xl font-bold">Product List</h1>
        <AddBoxIcon
          fontSize="large"
          onClick={() => {
            navigate('/admin/products/create');
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
                Are you sure you want to delete this product? This action cannot
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
                  onChange={(e) => setStockValue(e.target.value)}
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
          <Table aria-label="products table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Name</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Description</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Category</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Brand</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Price</h1>
                </TableCell>


                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Total Stock</h1>
                </TableCell>
                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Img</h1>
                </TableCell>

                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                  <h1 className="text-sm font-semibold">Action</h1>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) :
                products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 1 }}>
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow

                      key={product.id}
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
                        {product.name}
                      </TableCell>
                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                        {product.description}
                      </TableCell>

                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                        {product.category.name}
                      </TableCell>

                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                        {product.brand.name}
                      </TableCell>

                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                        {product.price}
                      </TableCell>

                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                        {product.total_stock}
                      </TableCell>
                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                          onError={(e) => (e.target.style.display = "none")} // hide broken img icons
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ px: 1, py: 0.5 }}>

                        <InfoOutlinedIcon
                        onClick={()=>navigate(`/admin/products/${product.id}/details`)}
                        className="cursor-pointer text-yellow-500 hover:text-yellow-700"
                        />
                        <AddIcon
                          onClick={() => navigate(`/admin/products_variations_create/${product.id}`)}
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                        />
                        <ModeEditOutlineOutlinedIcon
                          onClick={() => {
                            navigate(`/admin/products/${product.id}/edit`);
                          }}
                          className="cursor-pointer text-green-500 hover:text-green-700 ml-2"
                        />

                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleClickOpen(product.id, "delete")}
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
