import React from 'react'
import { Header } from "./";

const Layout = ({ children, categories, handleLogin }) => {
    //console.log(categories);
    return (
        <>
            <Header categories={categories} handleLogin={handleLogin}/>
            {children}
        </>
    )
}

export default Layout
