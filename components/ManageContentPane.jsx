import React, { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

const ManageContentPane = () => {

    const onDeleteArticleButton = (articleSlug) => {
        fetch('/api/deleteArticle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug: articleSlug }),
        })
            .then(res => {
                if (!res.ok) {
                    throw ReferenceError(res.status);
                }
                else {
                    fetch('/api/grabPosts')
                        .then((res) => res.json())
                        .then((data) => {
                            setPosts(data)
                        });
                }
                return res;
            })
            .catch(function (err) {
                //setErrorMsg(err.toString())
                console.log("Something went wrong");
            });;
    }

    const onDeleteCategoryButton = (categorySlug) => {
        fetch('/api/deleteCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug: categorySlug }),
        })
            .then(res => {
                if (!res.ok) {
                    throw ReferenceError(res.status);
                }
                else {
                    fetch('/api/grabCategories')
                        .then((res) => res.json())
                        .then((data) => {
                            setCategories(data)
                        });
                }
                return res;
            })
            .catch(function (err) {
                //setErrorMsg(err.toString())
                console.log("Something went wrong");
            });;
    }



    var [posts, setPosts] = useState([]);

    
   useEffect(() => {
       fetch('/api/grabPosts')
           .then((res) => res.json())
           .then((data) => {
               setPosts(data)
           })
   }, [])


    var [categories, setCategories] = useState([]);
    
    useEffect(() => {
        
        fetch('/api/grabCategories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data)
            })  
    }, [])

    const StartContent = ({ category }) => {

        return (<button
            onClick={() => {
                if (confirm(`Are you sure you want to delete the ${category.name} category? This will also delete all the posts listed under it!`)) {
                    onDeleteCategoryButton(category.slug);
                }
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
            </svg>
            <br />
        </button>);
    };

    const filterForCategory = (postArray, categorySlug) => {
        const result = postArray.filter((post) => post.categorySlug === categorySlug);
        return (result);
    }


    return (
        <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
        <h3 className='text-xl mb-8 font-semibold border-b pb-4'>
            Delete Articles or Categories
        </h3>
        <Accordion variant="bordered">
            {categories.map((category) => (
                <AccordionItem startContent={<StartContent category={category} />}
                    key={category.slug} aria-label="Accordion 1"
                    className='transition duration-700 text-center mb-8 cursor:pointer text-xl font-semibold'
                    title={category.name}>
                    {filterForCategory(posts, category.slug).map((post) => (
                        <ManagePostEntry post={post} onDelete={onDeleteArticleButton} key={post.title} />
                    ))}
                </AccordionItem>
            ))}
        </Accordion>
    </div>
    )

}

const ManagePostEntry = ({ post, onDelete }) => {

    return (
        <div className='bg-slate-300 shadow-lg rounded-lg p-0 lg:p-8 pb-12 mb-8'>
            <div className='relative overflow-hidden shadow-md pb-80 mb-6'>
                <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className='object-top absolute h-80 w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg'
                />
            </div>
            <h1 className='transition duration-700 text-center mb-8 cursor:pointer text-3xl font-semibold'>
                {post.title}
            </h1>
            <div className='block lg:flex text-center items-center justify-center mb-8 w-full '>
                <div className='flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-8'>
                    <img
                        alt={post.authorName}
                        className='align-middle rounded-full'
                        height="30px"
                        width="30px"
                        src={post.authorPhotoUrl}
                    />
                    <p className='inline align-middle text-gray-700 ml-2 text-lg'>{post.authorName}</p>
                </div>
                <div className='font-medium text-gray-700'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                        {post.createdAt}
                    </span>
                </div>
            </div>
            <p className='text-center text-lg text-gray-700 font-normal px-4 lg:px-20 mb-8'>{post.excerpt}</p>
            <div className='text-center'>
                <button
                    onClick={() => {
                        if (confirm("Are you sure you want to delete this post? This can't be undone!")) {
                            onDelete(post.slug);
                        }
                    }}
                >
                    <span className='transition duration-500 transform hover:-translate-y-1 inline-block bg-red-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer'>
                        Delete Post
                    </span>
                </button>
            </div>
        </div>
    )
}

export default ManageContentPane;