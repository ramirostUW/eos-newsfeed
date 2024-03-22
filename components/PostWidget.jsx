import React, { useState, useEffect } from 'react'
import Link from 'next/link';

const PostWidget = ({ relatedPosts }) => {

    relatedPosts = relatedPosts.recentPosts
    var slug = false;
    return (
        <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
            <h3 className='text-xl mb-8 font-semibold border-b pb-4'>
                {slug ? 'Related Posts':'Recent Posts'}
            </h3>
            {relatedPosts.map((post) => (
                <div key={post.title} className='flex items-center w-full mb-4'>
                    <div className='w-16 flex-none'>
                    <img 
                            alt={post.title}
                            height="60px"
                            width="60px"
                            className='align-middle rounded-full'
                            src={post.featuredImageUrl} 
                        />
                    </div>
                    <div className='flex-grow ml-4'>
                        <p className='text-gray-500 font-xs'>
                            {post.createdAt}
                        </p>
                        <Link href={`${post.articleURL}`} key={post.title} className='text-md'>
                            {post.title}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PostWidget
