import { useState, useEffect } from "react";

const Home1 = () => {
    useEffect(()=> {
        console.log("page loaded")
    }, [])

    return(
        <div>
        <p>hello</p>
        </div>

    );
    
};
export default Home1;