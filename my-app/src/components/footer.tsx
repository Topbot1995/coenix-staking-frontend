const Footer:React.FC = () => {
    return (
        <div className="gamfi-footer-section">
        <div className="container">
          <div className="footer-cta-area text-center active-shape hover-shape-inner">
            <h2 className="title mb-15">
              Apply for project<br />
              incubation
            </h2>
            <div className="dsc mb-40">
              If you want to lanuch an IGO/IDO, It will be your perfect choice
            </div>
            <a className="banner-btn wow fadeInUp black-shape" data-wow-delay="300ms" data-wow-duration="2500ms" href="igo-apply.html">
              <span className="btn-text">Apply For IGO</span>
              <span className="hover-shape1"></span>
              <span className="hover-shape2"></span>
              <span className="hover-shape3"></span>
            </a>
            <span className="border-shadow shadow-1"></span>
            <span className="border-shadow shadow-2"></span>
            <span className="border-shadow shadow-3"></span>
            <span className="border-shadow shadow-4"></span>
            <span className="hover-shape-bg hover_shape1"></span>
            <span className="hover-shape-bg hover_shape2"></span>
            <span className="hover-shape-bg hover_shape3"></span>
          </div>
        </div>
        <div className="footer-area">
          <div className="container">
            <div className="sec-heading text-center">
              <div className="sub-inner mb-52">
                <img className="heading-right-image" src="assets/images/icons/steps2.png" alt="Steps-Image" />
                <span className="sub-title white-color">Find us on Social</span>
                <img className="heading-left-image" src="assets/images/icons/steps.png" alt="Steps-Image" />
              </div>
            </div>
            <div className="footer-listing text-center mb-100 md-mb-70">
              <ul className="footer-icon-list">
                <li><a href="#"><i className="icon-twitter"></i></a></li>
                <li><a href="#"><i className="icon-telegram"></i></a></li>
                <li><a href="#"><i className="icon-medium"></i></a></li>
                <li><a href="#"><i className="icon-discord"></i></a></li>
                <li><a href="#"><i className="icon-linkedin"></i></a></li>
                <li><a href="#"><i className="icon-instagram"></i></a></li>
                <li><a href="#"><i className="icon-facebook"></i></a></li>
              </ul>
            </div>
            <div className="footer-logo text-center mb-45">
              <img src="assets/images/logo.png" alt="Footer-logo" />
            </div>
            <div className="footer-mainmenu text-center mb-20">
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">How it works</a></li>
                <li><a href="#">Token info</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Social media</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="copyright-area text-center mb-0">
              <div className="dsc mb-37">Copyright © 2022. All Rights Reserved by <a target="_blank" className="gafi" href="#">GaFi</a></div>
            </div>
            <div className="scrollup text-center">
              <a href="#"><i className="icon-arrow_up"></i></a>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Footer;