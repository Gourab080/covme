import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const navLinkProps = (path, animationDelay) => ({
    className: `${window.location.pathname === path ? 'focused' : ''}`,
    style: {
        animationDelay: `${animationDelay}s`,
    },
});

function Navbar({pages}) {
    const [expand, setExpand] = useState(false);
    return (
        <nav className="flex items-center flex-wrap bg-white text-primary py-2">
            <div className="container py-2 px-2 items-center font-bold text-lg">
                <div className="w-full flex items-center justify-between -my-2">
                    <NavLink exact={true} to='/' className="flex items-center cursor-pointer lg:flex">
                        <img
                            src="/images/covid.svg"
                            alt="logo"
                            className="h-10 w-auto mr-3"
                        />
                        <div className="text-xl font-bold text-black text-primary">
                            COVID-19 India
                        </div>
                    </NavLink>
                    
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
