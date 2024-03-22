import React, { useState, useRef } from "react";

const AddAdminPane = () => {

    const adminEmail = useRef();

    const [uploadError, setUploadError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [adminErrorMsg, setadminErrorMsg] = useState("Failed to add Admin");

    const onAdminSubmitButton = () => {
        setUploadSuccess(false);
        setUploadError(false);
        fetch('/api/createAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: adminEmail.current.value
            }),
        })
            .then(res => {
                if (!res.ok) {
                    throw ReferenceError(res.status);
                }
                else {
                    setUploadError(false);
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
                Add Admin
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                    type="text"
                    ref={adminEmail}
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="email address"
                    name="adminEmail"
                />
            </div>
            <div className="mt-8">
                <button type="button" 
                onClick={() => {
                    if (confirm("Are you sure you want to add this person as an admin? You won't be able to remove them!")) {
                        onAdminSubmitButton();
                    }
                }}
                    className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">Add admin</button>
                {uploadError && <p className="text-xl float-right font-semibold mt-3 text-red-500">{adminErrorMsg}</p>}
                {uploadSuccess && <p className="text-xl float-right font-semibold mt-3 text-green-500">{"Successfully added admin!"}</p>}
            </div>
        </div>
    )
}


export default AddAdminPane