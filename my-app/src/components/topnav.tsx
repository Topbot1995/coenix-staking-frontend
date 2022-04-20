const TopNav = () => {
    return (
        <div className="gamfi-breadcrumbs-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="breadcrumbs-area sec-heading">
                            <div className="sub-inner mb-15">
                                <a className="breadcrumbs-link" href="index.html">Home</a>
                                <span className="sub-title">Staking</span>
                                <img className="heading-left-image" src="assets/images/icons/steps.png" alt="Steps-Image" />
                            </div>
                            <h2 className="title mb-0">Staking</h2>
                        </div>
                    </div>
                    <div className="col-lg-7 breadcrumbs-form md-mt-30">
                        <div className="btn-area">
                            <a className="readon black-shape" href="">
                                <span className="btn-text">Leaderboard</span>
                                <span className="hover-shape1"></span>
                                <span className="hover-shape2"></span>
                                <span className="hover-shape3"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNav;