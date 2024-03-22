import React, { useState, useRef } from "react";

const AddCategoryPane = ( {fetchCategoryData} ) => {

    const categoryName = useRef();

    const [uploadError, setUploadError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [categoryErrorMsg, setCategoryErrorMsg] = useState("Failed to create category");

    const onCategorySubmitButton = () => {
        setUploadSuccess(false);
        setUploadError(false);
        fetch('/api/createCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: categoryName.current.value,
                slug: (categoryName.current.value).toLowerCase().replace(/ /g, "-") 
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw ReferenceError(res.status);
                }
                else {
                    setUploadError(false);
                    fetchCategoryData();
                    setUploadSuccess(true);
                }
                return res;
            })
            .catch(function (err) {
                //setErrorMsg(err.toString())
                setUploadError(true);
                setUploadSuccess(false);
            });;
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
            <h3 className="text-xl mb-8 font-semibold border-b pb-4">
                Create Category
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                    type="text"
                    ref={categoryName}
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="Category Name"
                    name="categoryName"
                />
            </div>
            <div className="mt-8">
                <button type="button" 
                onClick={() => {
                    onCategorySubmitButton(fetchCategoryData);
                }}
                className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                >
                    Create Category
                </button>
                {uploadError && <p className="text-xl float-right font-semibold mt-3 text-red-500">{categoryErrorMsg}</p>}
                {uploadSuccess && <p className="text-xl float-right font-semibold mt-3 text-green-500">{"Successfully added category!"}</p>}
            </div>
        </div>
    )
}


export default AddCategoryPane