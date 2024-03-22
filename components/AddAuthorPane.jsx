import React, { useState, useRef } from "react";

const AddAuthorPane = () => {

    const [uploadError, setUploadError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [authorErrorMsg, setAuthorErrorMsg] = useState("Failed to add Author");

    const authorImageChange = (e) => {

        var newVal = e.target.value;
        if (newVal === "") {
            newVal = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
        }
        setAuthorImagePreview(newVal);
    }

    const [authorImagePreview, setAuthorImagePreview] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");

    const authorName = useRef();
    const authorEmail = useRef();

    const onAuthorSubmitButton = () => {
        setUploadSuccess(false);
        setUploadError(false);
        fetch('/api/createAuthor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: authorName.current.value,
                photoURL: authorImagePreview,
                email: authorEmail.current.value,
                slug: (authorName.current.value).toLowerCase().replace(/ /g, "-") + (new Date()).valueOf()
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
                Add Author
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                    type="text"
                    ref={authorEmail}
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="email address"
                    name="authorEmail"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                    type="text"
                    ref={authorName}
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="name"
                    name="author Name"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <input
                    type="text"
                    className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                    placeholder="photo URL"
                    name="author Photo URL"
                    onChange={authorImageChange}
                />
            </div>
            <div>
                <h1>Author Picture Preview:</h1>
                <img
                    alt={"Author Picture Preview"}
                    className='align-middle rounded-full'
                    height="60px"
                    width="60px"
                    src={authorImagePreview}
                />
            </div>
            <div className="mt-8">
                <button type="button" onClick={onAuthorSubmitButton}
                    className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">Add author</button>
                {uploadError && <p className="text-xl float-right font-semibold mt-3 text-red-500">{authorErrorMsg}</p>}
                {uploadSuccess && <p className="text-xl float-right font-semibold mt-3 text-green-500">{"Successfully added author!"}</p>}
            </div>
        </div>
    )
}


export default AddAuthorPane