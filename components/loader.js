    import React from "react";

const Loader = () => {
    return (
        <>
            <div className="d-flex align-items-center justify-content-center w-100 h-100 min-vh-100">
                {/* <Spinner animation="grow" /> */}
                <div dir="auto" className="custom-loader-animation">
                    <span>I</span>
                    <span>T</span>
                    <span>C</span>
                    <span>-</span>
                    <span>D</span>
                    <span>A</span>
                    <span>S</span>
                    <span>H</span>
                    <span>B</span>
                    <span>O</span>
                    <span>A</span>
                    <span>R</span>
                    <span>D</span>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>

                </div>
            </div>
        </>
    );
};
export default Loader;
