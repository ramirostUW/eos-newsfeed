import React, { useState, useRef } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from "../msAuthConfig/authConfig";
import { callMsGraph } from '../msAuthConfig/graph';

function LoginPage() {

    const { instance, accounts } = useMsal();

    return (
        <div>
            <UnauthenticatedTemplate>
                <LogInButton instance={instance} />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <BasicProfileInfo instance={instance} accounts={accounts} />
                <WebsitePerms accounts={accounts} />
            </AuthenticatedTemplate>

        </div>
    )
}

const LogInButton = ({ instance }) => {

    const [uploadError, setUploadError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch((e) => {
                console.log(e);
                setUploadError(true);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch((e) => {
                console.log(e);
                setUploadError(true);
            });
        }
    };

    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="col-span-1 lg:col-span-8">
                    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>

                        <button
                            type="button"
                            onClick={() => handleLogin("popup")}
                            className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                        >
                            Log In
                        </button>
                        {uploadError && <p className="text-xl float-right font-semibold mt-3 text-red-500">{"There was an error!"}</p>}
                        {uploadSuccess && <p className="text-xl float-right font-semibold mt-3 text-green-500">{"Successfully logged out"}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

const BasicProfileInfo = ({ instance, accounts }) => {

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/",
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    };

    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="col-span-1 lg:col-span-8">
                    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
                        <h1>You are logged in!</h1>
                        <br />
                        {accounts[0] ? (
                            <div id="profile-div">
                                <p>
                                    <strong>Email address: </strong> {accounts[0].username}
                                </p>
                                <p>
                                    <strong>Name: </strong> {accounts[0].name}
                                </p>
                            </div>
                        ) : <h1>You seem to be logged in, but your account information could not be found.</h1>
                        }
                        <br />
                        <button
                            type="button"
                            onClick={() => handleLogout("popup")}
                            className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const WebsitePerms = ({ accounts }) => {

    const [pageAdmin, setPageAdmin] = useState();
    const [loadedAdminInfo, setLoadedAdminInfo] = useState(false);
    function fetchAdminData() {
        const email = accounts[0].username;
        fetch('/api/grabAdminInfo?email=' + encodeURIComponent(email))
            .then((res) => res.json())
            .then((data) => {
                setPageAdmin(data[0]);
                setLoadedAdminInfo(true);
            })
    }

    const [postAuthor, setPostAuthor] = useState();
    const [loadedAuthorInfo, setLoadedAuthorInfo] = useState(false);

    function fetchAuthorData() {
        const email = accounts[0].username;
        fetch('/api/grabAuthorInfo?email=' + encodeURIComponent(email))
            .then((res) => res.json())
            .then((data) => {
                setPostAuthor(data[0]);
                setLoadedAuthorInfo(true);
            })
    }

    const [requestedAccInfo, setRequestedAccInfo] = useState(false);

    const onRequestButton = () => {
        fetchAdminData();
        fetchAuthorData();
        setRequestedAccInfo(true);

    }
    return (
        <div className="container mx-auto px-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="col-span-1 lg:col-span-8">
                    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>

                        {!requestedAccInfo && <button
                            type="button"
                            onClick={onRequestButton}
                            className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                        >
                            View/Edit Website Profile
                        </button>}
                        {requestedAccInfo && <div>
                            <ManageAuthorCredentials
                                postAuthor={postAuthor}
                                loadedAuthorInfo={loadedAuthorInfo}
                                fetchAuthorData={fetchAuthorData}
                            />
                            <ManageAdminCredentials pageAdmin={pageAdmin} loadedAdminInfo={loadedAdminInfo} />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ManageAdminCredentials = ({ loadedAdminInfo, pageAdmin }) => {
    return (
        <div>
            <h3 className="text-xl mb-4 font-semibold border-b pb-4">
                Admin Credentials
            </h3>
            {!loadedAdminInfo && <p>Checking credentials ...</p>}
            {(loadedAdminInfo && !pageAdmin) && <p> This account is not currently authorized to act as an Admin.</p>}
            {(loadedAdminInfo && pageAdmin) && <p> This account is authorized to act as an Admin.</p>}
        </div>
    )
}

const ManageAuthorCredentials = ({ loadedAuthorInfo, postAuthor, fetchAuthorData }) => {

    const [editingCredentials, setEditingCredentials] = useState(false);

    const [uploadError, setUploadError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [authorErrorMsg, setAuthorErrorMsg] = useState("Failed to edit Author");

    const AuthorDisplayForm = () => {
        const authorImage = postAuthor.authorPhotoUrl;
        return (
            <div>
                <div id="profile-div">
                    <p>
                        <strong>Author Name: </strong> {postAuthor.authorName}
                    </p>
                    <p>
                        <strong>Author Image: </strong>
                        <img
                            alt={"Author Picture Preview"}
                            className='align-middle rounded-full'
                            height="60px"
                            width="60px"
                            src={authorImage}
                        />
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => { setEditingCredentials(true) }}
                    className="mt-4 float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                >
                    Edit
                </button>
            </div>
        )
    }

    const AuthorEditForm = () => {
        const [authorName, setAuthorName] = useState(postAuthor.authorName);
        const [authorImagePreview, setAuthorImagePreview] = useState(postAuthor.authorPhotoUrl);

        const authorImageChange = (e) => {

            var newVal = e.target.value;
            if (newVal === "") {
                newVal = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
            }
            setAuthorImagePreview(newVal);
        }

        const onAuthorSubmitButton = () => {
            setUploadSuccess(false);
            setUploadError(false);
            fetch('/api/editAuthor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: authorName,
                    photoURL: authorImagePreview,
                    email: postAuthor.authorEmail
                }),
            })
                .then(res => {
                    if (!res.ok) {
                        throw ReferenceError(res.status);
                    }
                    else {
                        setEditingCredentials(false);
                        fetchAuthorData();
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

            <div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                        type="text"
                        defaultValue={postAuthor.authorName}
                        className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
                        placeholder="name"
                        name="author Name"
                        onChange={(e) => { setAuthorName(e.target.value) }}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                        type="text"
                        defaultValue={postAuthor.authorPhotoUrl}
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
                <button
                    type="button"
                    onClick={onAuthorSubmitButton}
                    className="mt-4 mr-2 float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                >
                    Submit
                </button>
                <button
                    type="button"
                    onClick={() => { setEditingCredentials(false) }}
                    className="mt-4 float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        )
    }
    return (
        <div className="mb-16" >
            <h3 className="text-xl mb-4 font-semibold border-b pb-4">
                Author Credentials
            </h3>
            {!loadedAuthorInfo && <p>Checking credentials ...</p>}
            {(loadedAuthorInfo && !postAuthor) && <p> This account is not currently authorized to act as an Author.</p>}
            {(loadedAuthorInfo && postAuthor) && <div> {editingCredentials ? <AuthorEditForm /> : <AuthorDisplayForm />} </div>}
            {uploadError && <p className="text-xl float-left font-semibold mt-3 text-red-500">{authorErrorMsg}</p>}
            {uploadSuccess && <p className="text-xl float-left font-semibold mt-3 text-green-500">{"Successfully edited author setings!"}</p>}

        </div>
    )
}

export default LoginPage;