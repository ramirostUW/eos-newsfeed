import React from "react";
//import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

const TestPage = () => {
    const router = useRouter()

    return (
        <h1>{router.asPath +" page"}</h1>
    )
}

export default TestPage;