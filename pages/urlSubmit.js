import React, { useRef, useState, useEffect } from 'react';
import { AccountBeingLookedUpBox, NotLoggedInBox, PostCard, AddCategoryPane } from "../components";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import Link from 'next/link';
import { useRouter, redirect } from 'next/navigation';


const revalidateAndReturnHome = () => {
  fetch('/api/grabCategories')
  .then((res) => res.json())
  .then((data) => {
    //redirect('/');
  })
}


function SubmitPage() {

  const { instance, accounts } = useMsal();

  const [postAuthor, setPostAuthor] = useState();
  const [loadedAuthorInfo, setLoadedAuthorInfo] = useState(false);

  const router = useRouter();

  const revalidateAndReturnHome = () => {
    fetch('/api/grabCategories')
    .then((res) => res.json())
    .then((data) => {
      router.push('/')
    })
  }


  function fetchAuthorData() {
    const email = accounts[0].username;
    fetch('/api/grabAuthorInfo?email=' + encodeURIComponent(email))
      .then((res) => res.json())
      .then((data) => {
        setPostAuthor(data[0]);
        setLoadedAuthorInfo(true);
      })
  }

  useEffect(() => {
    if (!(accounts[0] == null)) {
      fetchAuthorData();
    }
  }, [accounts])

  var [categories, setCategories] = useState([]);

  function fetchCategoryData() {
    fetch('/api/grabCategories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
      })
  }
  useEffect(() => {
    fetchCategoryData();
  }, [])

  const urlSubmission = useRef();
  const [inputDisabled, setInputDisabled] = useState(false);

  const [previewPost, setPreviewPost] = useState({ ...samplePost });

  const onUploadButton = () => {
    fetch('/api/createArticle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(previewPost),
    })
      .then(res => {
        if (!res.ok) {
          throw ReferenceError(res.status);
        }
        else {
          setUploadError(false);
          setUploadSuccess(true);
          revalidateAndReturnHome();
        }
        //return res;
      })
      .catch(function (err) {
        //setErrorMsg(err.toString())
        setUploadError(true);
        setUploadSuccess(false);
      }); 

    //const router = useRouter();
    //router.push('/manageSite')
  }
  const [uploadError, setUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  return (
    <div>
      <UnauthenticatedTemplate>
        <div className="container mx-auto px-10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="col-span-1 lg:col-span-8">
              <NotLoggedInBox />
            </div>
          </div>
        </div>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>

        <div className="container mx-auto px-10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="col-span-1 lg:col-span-8">
              {(!(postAuthor) && !loadedAuthorInfo) && <AccountBeingLookedUpBox />}kl
              {(!(postAuthor) && loadedAuthorInfo) && <AccountNotAuthorizedBox />}
              {(postAuthor &&
                <URLPreviewer
                  urlSubmission={urlSubmission}
                  inputDisabled={inputDisabled}
                  setInputDisabled={setInputDisabled}
                  previewPost={previewPost}
                  setPreviewPost={setPreviewPost}
                  categories={categories}
                  postAuthor={postAuthor}
                />)}

              {inputDisabled && <NewPostSettings
                categories={categories}
                previewPost={previewPost}
                setPreviewPost={setPreviewPost}
                urlSubmission={urlSubmission}
                postAuthor={postAuthor}
              />}

              {inputDisabled && <PostCard post={previewPost} />}

              {inputDisabled && <AddCategoryPane fetchCategoryData={fetchCategoryData} />}

              {inputDisabled && <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
                <button
                  type="button"
                  onClick={onUploadButton}
                  className="float-center transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
                >
                  Upload Link
                </button>
                {uploadError && <p className="text-xl float-right font-semibold mt-3 text-red-500">{"Failed to Upload"}</p>}
                {uploadSuccess && <p className="text-xl float-right font-semibold mt-3 text-green-500">{"Successfully uploaded link!"}</p>}
              </div>}
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </div>
  );
}

const NewPostSettings = ({ categories, previewPost, setPreviewPost, urlSubmission, postAuthor }) => {

  const categoryDropdownChange = (e) => {

    const newPreviewPost = { ...previewPost }
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index]
    const option = el.getAttribute('id');
    newPreviewPost["categorySlug"] = option;

    setPreviewPost(newPreviewPost);

  }

  const onFormChange = (e, previewPostAttr) => {
    const newPreviewPost = { ...previewPost }
    newPreviewPost[previewPostAttr] = e.target.value;

    setPreviewPost(newPreviewPost);
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">
        Edit Post
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <input
          type="text"
          onChange={(e) => { onFormChange(e, "title") }}
          defaultValue={previewPost.title}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          placeholder="Title"
          name="title"
        />
        <input
          type="text"
          onChange={(e) => { onFormChange(e, "featuredImageUrl") }}
          defaultValue={previewPost.featuredImageUrl}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          placeholder="Image URL"
          name="imageURL"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea
          defaultValue={previewPost.excerpt}
          onChange={(e) => { onFormChange(e, "excerpt") }}
          className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          name="description" placeholder="Description"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <select defaultValue={categories[0].submission} onChange={categoryDropdownChange} id="category">
          {categories.map((category) => (
            <option id={category.slug}>{category.name}</option>
          ))}
        </select>
      </div>
      <p className='text-red-500'>
        <strong>Hint: </strong> The box right below this one is a preview of what your new post will look like.
        If you'd like to create a new category, rather than use an existing one, there's an option to do so below the preview.
      </p>
    </div>
  )
}

const URLPreviewer = ({ urlSubmission, inputDisabled, setInputDisabled,
  previewPost, setPreviewPost, categories, postAuthor }) => {

  const [errorMsg, setErrorMsg] = useState("No Error");
  const [submitError, setSubmitError] = useState(false);


  const updatePostPreview = (title, excerpt, imageURL, articleURL, categorySlug, authorSlug, authorPhotoUrl, authorName) => {
    var newPreviewPost = { ...previewPost }
    newPreviewPost["title"] = title;
    newPreviewPost["excerpt"] = excerpt;
    newPreviewPost["featuredImageUrl"] = imageURL;
    newPreviewPost["articleURL"] = articleURL;
    newPreviewPost["categorySlug"] = categorySlug;
    newPreviewPost["authorSlug"] = authorSlug;
    newPreviewPost["authorPhotoUrl"] = authorPhotoUrl;
    newPreviewPost["authorName"] = authorName;

    setPreviewPost(newPreviewPost);
  }

  const onURLButtonClick = () => {
    if (!inputDisabled) {
      fetch('/api/urlTagScrape?url=' + urlSubmission.current.value)
        .then(res => {
          if (!res.ok) {
            throw ReferenceError(res.status);
          }
          else {
            setSubmitError(false);
            setErrorMsg("No error");
          }
          return res;
        })
        .then((res) => res.json())
        .then((data) => {
          //setUrlMetaTags(data);
          updatePostPreview(
            data['og:title'],
            data['og:description'],
            data['og:image'],
            urlSubmission.current.value,
            categories[0].slug,
            postAuthor.authorSlug,
            postAuthor.authorPhotoUrl,
            postAuthor.authorName
          );
          setInputDisabled(true);

        })
        .catch(function (err) {
          setErrorMsg(err.toString())
          setSubmitError(true);
        });
    }
    else {
      setInputDisabled(false);
      //setUrlMetaTags(initialMetaTags);
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">
        Upload a link
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <input
          type="text"
          ref={urlSubmission}
          disabled={(inputDisabled) ? "disabled" : ""}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          placeholder="URL"
          name="myUrl"
        />
      </div>
      <button onClick={onURLButtonClick}
        className="transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer"
      >
        {!inputDisabled ? "Preview URL" : "Edit URL"}
      </button>
      <br />
      {submitError && <p className="text-xs text-red-500">{errorMsg}</p>}
    </div>
  )
}

const AccountNotFoundBox = () => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold pb-4'>
        You seem to be logged in, but your account details could not be found.
      </h3>
      <p className='pb-4'>
        It is recommended to
        <Link href={`/eosLogin`} className='text-blue-500'> log out </Link>
        and then try logging back in.
      </p>
    </div>
  )
}

const AccountNotAuthorizedBox = () => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold pb-4'>
        You are not currently authorized to upload new Links.
      </h3>
      <p className='pb-4'>
        You may be logged on the wrong Microsoft account. Go to the
        <Link href={`/eosLogin`} className='text-blue-500'> login page </Link>
        to check which account you are currently logged in to.
      </p>
    </div>
  )
}

const samplePost = {
  "title": "",
  "excerpt": "",
  "articleURL": "",
  "slug": ("submission-" + (new Date()).valueOf()),
  "featuredImageUrl": "",
  "authorSlug": "sample-author",
  "categorySlug": "false-category",
  "createdAt": (new Date()).toISOString().split('T')[0],
  "authorName": "Sample Author",
  "authorPhotoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
}


export default SubmitPage;
