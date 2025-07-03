import Isotope from "isotope-layout";
import { useEffect, useRef, useState } from "react";
const Portfolio = () => {
  // Isotope
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");
  useEffect(() => {
    isotope.current = new Isotope(".portfolio-content", {
      itemSelector: ".grid-item",
      //    layoutMode: "fitRows",
      percentPosition: true,
      masonry: {
        columnWidth: ".grid-item",
      },
      animationOptions: {
        duration: 750,
        easing: "linear",
        queue: false,
      },
    });
    return () => isotope.current.destroy();
  });
  useEffect(() => {
    if (isotope.current) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey]);
  const handleFilterKeyChange = (key) => () => {
    setFilterKey(key);
  };
  const activeBtn = (value) => (value === filterKey ? "active" : "");
  return (
    <section
      id="work"
      data-nav-tooltip="Work"
      className="pp-section pp-scrollable section dark-bg"
    >
      <div className="container">
        <div className="title">
          <h3>My Portfolio.</h3>
        </div>
        <div className="portfolio-filter-01">
          <ul className="filter nav">
            <li
              className={`c-pointer ${activeBtn("*")}`}
              onClick={handleFilterKeyChange("*")}
              data-filter="*"
            >
              All
            </li>
            <li
              className={`c-pointer ${activeBtn("web3")}`}
              onClick={handleFilterKeyChange("web3")}
              data-filter=".web3"
            >
              Web3
            </li>
            <li
              className={`c-pointer ${activeBtn("uiux")}`}
              onClick={handleFilterKeyChange("uiux")}
              data-filter=".uiux"
            >
              Ui/Ux
            </li>
            <li
              className={`c-pointer ${activeBtn("fashion")}`}
              onClick={handleFilterKeyChange("fashion")}
              data-filter=".fashion"
            >
              Product
            </li>
          </ul>
        </div>{" "}
        {/* Portfolio Filter */}
        <div className="portfolio-content grid-gutter-lg grid-col-3 lightbox-gallery">
          <div className="grid-item product web3 fashion">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Kushlion Drip</h5>
                <span>GCG NFT with physical toy claim</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-1.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-1.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item uiux">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-2.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-2.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item product web3">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-3.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-3.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item product uiux">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-5.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-5.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item web3">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-4.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-4.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item product uiux">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-6.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-6.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item fashion">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-7.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-7.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item product web3">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">The Darwins</h5>
                <span>NFT with Gaming Mechanics</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-8.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-8.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
          <div className="grid-item fashion">
            <div className="portfolio-box-01">
              <div className="portfolio-info">
                <h5 className="white-color font-weight-bold">Coming Soon</h5>
                <span>Coming Soon</span>
              </div>
              <div className="portfolio-img">
                <img src="static/img/m-portfolio-9.jpg" title="" alt="" />
                <div className="portfolio-icon">
                  <a
                    href="static/img/m-portfolio-9.jpg"
                    className="gallery-link"
                  >
                    <span className="ti-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* grid item */}
        </div>
      </div>
    </section>
  );
};
export default Portfolio;
