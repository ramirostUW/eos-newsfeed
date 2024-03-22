import React, { useState, useEffect } from 'react'
import Link from 'next/link';


const Header = ({ categories }) => {

    /*
    <button onClick={() => handleLogin("popup")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
    */
   const navBarLinks = [
       {
           name: "Log in",
           slug: "eosLogin"
       },
       {
            name: "Upload New Link",
            slug: "urlSubmit"
        },
        {
            name: "Manage Site",
            slug: "manageSite"
        }
   ]
    return (
        <div className='container mx-auto px-10 mb-8'>
            <div className='border-b w-full inline-block border-blue-400 py-8'>
                <div className='md:float-left block'>
                    <Link href="/">
                        <span className='cursor-pointer font-bold text-4xl text-white'>
                            Data Trends in Education
                        </span>
                    </Link>
                    
                </div>
                <div className="hidden md:float-left md:contents">
                    {navBarLinks.map((category) => (
                        <Link key={category.slug} href={`/${category.slug}`/*`/category/${category.slug}`*/}>
                            <span className='md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer'>
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Header
