import React from "react";

export const PageLoader: React.FC = () => {

    return (
        <section className="loader_first" style={{position: 'fixed', top:"-50vh", height:"10vh"}}>
            <div className="circular-spinner"></div>
        </section>
    );
}