import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getData } from '../../axios/axios';

export default function VariantEdit() {
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const [product, setProduct] = useState();
    const [attributes, setAttributes] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    // const [images, setImages] = useState([]);
    const [variantImages, setVariantImages] = useState([]);       // actual files
    const [variantPreviews, setVariantPreviews] = useState([]);   // for showing previews

    const [previews, setPreviews] = useState([]);
    const [attr, setAttr] = useState({});
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState("");
    const [variants, setVariants] = useState([]);
    const { id } = useParams();

    const getProductVariantDetail = async (id) => {
        let response = await getData("products/variants/" + id);
        if (response.status === 200) {
            setProduct(response.data);
            setVariants(response.data);
            setName(response.data.name);
            setPrice(response.data.price);
            setStock(response.data.stock);
            setDescription(response.data.description);
            setAttributes(response.data.attributes || []);
            
        }
    };
    useEffect(()=>{
        getProductVariantDetail(id);
    },[])

    const handleImageChange = (e) => {

        const files = Array.from(e.target.files);
        if (files.length > 6) {
            alert("You can only upload up to 6 images.");
            files.length = 0;
            return;
        } else {
            setVariantImages(files);
            const previewUrls = files.map((file) => URL.createObjectURL(file));
            setVariantPreviews(previewUrls);
        }
    };
    const handleRemoveImage = (index) => {
        const newImages = [...variantImages];
        const newPreviews = [...variantPreviews];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setVariantImages(newImages);
        setVariantPreviews(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className=" w-4/5 mx-auto my-10 px-40 py-5 rounded-lg shadow-lg"
            >
                <h1 className="text-center text-xl font-bold">Edit Product Variation</h1>
                <h1 className=''>Attributes</h1>
                <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    value={name}

                    className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                    placeholder="Variant Name"
                />

                <input
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    value={price}

                    className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                    placeholder="Price"
                />

                <input
                    onChange={(e) => setStock(e.target.value)}
                    type="number"
                    value={stock}
                    className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                    placeholder="Stock quantity"
                />

                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    value={description}

                    className="w-full py-3 px-4 mt-5 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:border-2"
                    placeholder="Description"
                />
                {attributes.map((a) => (
                    <input
                        key={a.id}
                        type="text"
                        placeholder={a.name}
                        value={attr[a.id] || ""}
                        onChange={(e) =>
                            setAttr((prev) => ({
                                ...prev,        // keep other attribute values
                                [a.id]: e.target.value, // update only this one
                            }))
                        }
                        className="w-full py-3 px-4 mt-2 mb-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    />
                ))}

                <label htmlFor="upload-images">
                    <Button component="span">
                        Upload Images
                    </Button>
                </label>





                <div className="flex flex-col gap-4 w-full">
                    {/* Upload Button */}
                    <input
                        accept="image/*"
                        id="upload-images"
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />


                    {/* Previews */}
                    {variantPreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4 w-full">
                            {variantPreviews.map((src, idx) => (
                                <div className="relative w-32 h-32" key={idx}>
                                    <span
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs z-10"
                                    >
                                        x
                                    </span>

                                    <img
                                        src={src}
                                        alt={`preview-${idx}`}
                                        className="rounded-md border w-32 h-32 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        variant="contained"
                        className="w-full"
                        type="submit"
                    >
                        Apply
                    </Button>
                </div>
            </form>
        </div>
    )
}
