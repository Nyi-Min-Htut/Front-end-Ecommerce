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

export default function Brand() {
    const [open, setOpen] = useState(false);
    const [brandName, setbrandName] = useState("");
    const [brandDescription, setbrandDescription] = useState("");
    const [requiredID, setRequireID] = useState(null);
    const [modalType, setModalType] = useState("");
    const [name, setName] = useState("");
    const [brands, setbrands] = useState([]);
    const [loading, setLoading] = useState(true); // initially loading
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [brandImage, setBrandImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const getbrands = async () => {
        setLoading(true); // start loading
        let response = await getData("brands?page=" + page);
        if (response.status === 200) {
            setbrands(response.data.data);
            setTotalPages(response.data.data.last_page);
        } else {
            setbrands([]); // handle error by emptying array
        }
        setLoading(false); // done loading
    };

    useEffect(() => {
        getbrands();
    }, [page]);

    const handleClickOpen = async (id, modal) => {
        if (modal == "create") {
            setModalType("create");
        } else if (modal == "update") {
            let response = await getData(`brands/${id}`);
            setbrandName(response.data.name);
            setbrandDescription(response.data.description);
            setImagePreview(response.data.image_url);
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

        if (!brandName || !brandDescription) {
            toast.error("Please fill in all fields");
            return;
        }

        if(brandImage == null){
            toast.warning("Please upload brand image");
            return;
        }

        let formdata = new FormData();
        formdata.append("name", brandName);
        formdata.append("description", brandDescription);
        formdata.append("image", brandImage);

        let response = await postData("brands", formdata);

        if (response.status == 200) {
            setbrandName("");
            setbrandDescription("");
            getbrands();
            handleClose();
            setBrandImage('');
            toast.success("brand created successfully");
        } else {
            alert("Error creating brand: " + response.error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!brandName || !brandDescription) {
            toast.error("Please fill in all fields");
            return;
        }
        let formdata = new FormData();
        formdata.append("name", brandName);
        formdata.append("description", brandDescription);
        formdata.append('image',brandImage);
        let response = await postData(`brands/${requiredID}`, formdata);
        if (response.status == 200) {
            setbrandName("");
            setbrandDescription("");
            getbrands();
            handleClose();
            setBrandImage('');
            toast.success("brand updated successfully");
        } else {
            alert("Error updating brand: " + response.error);
        }
    };

    const handleDelete = async () => {
        let response = await deleteData(`brands/${requiredID}`);
        if (response.status === 200) {
            toast.success("brand deleted successfully");
            getbrands();
            handleClose();
        } else {
            toast.error("Error deleting brand: " + response.error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setBrandImage(file);

        const previewImage = URL.createObjectURL(file);
        setImagePreview(previewImage);
    }

    return (
        <div>
            {name}
            <div
                className="flex justify-between mx-10 my-5"
                title="Create New brand List"
            >
                <h1 className="text-xl font-bold">Brand List</h1>
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
                            Create New brand
                        </h1>
                        <DialogContent>
                            <DialogContentText>
                                To create a new brand, please enter the brand name here.
                            </DialogContentText>
                            <form onSubmit={handleSubmit}>
                                <input
                                    onChange={(e) => setbrandName(e.target.value)}
                                    value={brandName}
                                    type="text"
                                    className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                                    placeholder="Brand Name"
                                />

                                <input
                                    onChange={(e) => setbrandDescription(e.target.value)}
                                    value={brandDescription}
                                    type="text"
                                    className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                                    placeholder="Brand Description"
                                />

                                <input
                                    accept="image/*"
                                    id="upload-images"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />

                               <div className='flex justify-center'>
                                 {imagePreview && (
                                    <div style={{ marginTop: "10px" }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                               </div>
                                <label htmlFor="upload-images">
                                    <Button component="span">
                                        Upload Images
                                    </Button>
                                </label>
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
                            Update brand
                        </h1>
                        <DialogContent>
                            <DialogContentText>
                                To create a new brand, please enter the brand name here.
                            </DialogContentText>
                            <form onSubmit={handleEdit}>
                                <input
                                    onChange={(e) => setbrandName(e.target.value)}
                                    value={brandName}
                                    type="text"
                                    className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                                    placeholder="brand Name"
                                />

                                <input
                                    onChange={(e) => setbrandDescription(e.target.value)}
                                    value={brandDescription}
                                    type="text"
                                    className="w-full py-3 px-4 mt-7 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                                    placeholder="brand Description"
                                />

                                 <input
                                    accept="image/*"
                                    id="upload-images"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />

                               <div className='flex justify-center'>
                                 {imagePreview && (
                                    <div style={{ marginTop: "10px" }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                               </div>
                                <label htmlFor="upload-images">
                                    <Button component="span">
                                        Upload Images
                                    </Button>
                                </label>
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
                                Are you sure you want to delete this brand? This action
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
                    <Table aria-label="brands table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                                    <h1 className="text-sm font-semibold">brand Name</h1>
                                </TableCell>
                                <TableCell align="center" sx={{ px: 1, py: 0.5 }}>
                                    <h1 className="text-sm font-semibold">
                                        brand Description
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
                                        Loading brands...
                                    </TableCell>
                                </TableRow>
                            ) : brands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No brands found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                brands.map((brand) => (
                                    <TableRow key={brand.id} hover>
                                        <TableCell align="center">{brand.name}</TableCell>
                                        <TableCell align="center">
                                            {brand.description || "No description available"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <ModeEditOutlineOutlinedIcon
                                                onClick={() => handleClickOpen(brand.id, "update")}
                                                className="cursor-pointer text-green-500 hover:text-green-700"
                                            />
                                            <DeleteOutlineOutlinedIcon
                                                onClick={() => handleClickOpen(brand.id, "delete")}
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
