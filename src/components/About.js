const About = () => {
  return (
    <section
      id="about"
      data-nav-tooltip="About"
      className="pp-section pp-scrollable section counter"
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 m-15px-tb">
            <div className="about-me">
              <div className="img">
                <div className="img-in">
                  <img src="static/img/kld1.png" title="" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 m-15px-tb">
            <div className="about-info">
              <div className="title">
                <h3>About me.</h3>
              </div>
              <div className="about-text">
                <h3>
                {`I'm`} a globe-trotting software engineer and OIF veteran.
                </h3>
                <p>
                As a former Sergeant in the US Army, I bring discipline and tenacity to my work, and graduated Salutatorian from Full Sail University with a Bachelor's in Computer Science. 
                My expertise spans from building ETLs for machine learning teams to developing full-stack Web3 projects.

                </p>
                <div className="row">
                  <div className="col-auto">
                    <div className="media align-items-center">
                      <span className="count">Fast</span>
                      <div className="media-body">
                        Service 
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="media align-items-center">
                      <span className="count">Quality</span>
                      <div className="media-body">
                        Results
                      </div>
                    </div>
                  </div>
                </div>
                <div className="btn-bar">
                  <a className="px-btn px-btn-theme" href="#contactme">
                    <span>Contact Me</span>
                  </a>
                  <a className="px-btn px-btn-theme" href="#work">
                    <span>Portfolio</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="separated" />
        <div className="title">
          <h3>Education &amp; Skills</h3>
        </div>
        <div className="row">
          <div className="col-lg-4 m-15px-tb">
            <ul className="aducation-box">
              <li>
                <span>2005 - 2011</span>
                <h6>Sergeant</h6>
                <p>United States Army</p>
              </li>
              <li>
                <span>2017 - 2021</span>
                <h6>BSCS</h6>
                <p>Full Sail University</p>
              </li>
              <li>
                <span>2022 - Now</span>
                <h6>GO Systems Engineer</h6>
                <p>Trugard Labs</p>
              </li>
            </ul>
          </div>
          <div className="col-lg-7 ml-auto m-15px-tb">
            <div className="skills-box">
              <h3>My skills</h3>
              <p>
                {`I'm`} a For-hire Software Engineer with a passion for building
                cutting-edge solutions to complex problems.
              </p>
              <div className="skill-lt">
                <h6>Go Lang</h6>
                <div className="skill-bar">
                  <div className="skill-bar-in" style={{ width: "92%" }}>
                    <span data-toggle="tooltip" title="92%" />
                  </div>
                </div>
              </div>
              {/* /skill */}
              <div className="skill-lt">
                <h6>ML Ops</h6>
                <div className="skill-bar">
                  <div className="skill-bar-in" style={{ width: "72%" }}>
                    <span data-toggle="tooltip" title="72%" />
                  </div>
                </div>
              </div>
              {/* /skill */}
              <div className="skill-lt">
                <h6>Node</h6>
                <div className="skill-bar">
                  <div className="skill-bar-in" style={{ width: "86%" }}>
                    <span data-toggle="tooltip" title="86%" />
                  </div>
                </div>
              </div>
              {/* /skill */}
              <div className="skill-lt">
                <h6>Microservices</h6>
                <div className="skill-bar">
                  <div className="skill-bar-in" style={{ width: "88%" }}>
                    <span data-toggle="tooltip" title="88%" />
                  </div>
                </div>
              </div>
              {/* /skill */}
            </div>
          </div>
        </div>
        <div className="separated" />
        <div className="title">
          <h3>Experience.</h3>
        </div>
        <div className="resume-box">
          <div className="resume-row">
            <div className="row">
              <div className="col-sm-3 col-md-3 col-xl-2">
                <div className="rb-left">
                  <img src="static/img/go.png" title="" alt="" />
                </div>
              </div>
              <div className="col-sm-9 col-md-9 col-xl-10">
                <div className="rb-right">
                <h6>Systems Engineer</h6>
                  <label>Trugard Labs | Remote | Nov 2022 - Present</label>
                  <div className="rb-time">Full Time</div>
                  <p>
                    At Trugard Labs, I am responsible for the development of
                    Trugard's core product, a machine learning platform for
                    detecting and preventing fraud on various blockchains.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="resume-row">
            <div className="row">
              <div className="col-sm-3 col-md-3 col-xl-2">
                <div className="rb-left">
                  <img src="static/img/web3.png" title="" alt="" />
                </div>
              </div>
              <div className="col-sm-9 col-md-9 col-xl-10">
                <div className="rb-right">
                  <h6>CTO</h6>
                  <label>Tacvue | Remote | Oct 2021 - Nov 2021</label>
                  <div className="rb-time">Full Time</div>
                  <p>
                    As the CTO of Tacvue, I am responsible for the development
                    of the Tacvue platform and the management of the Tacvue
                    engineering team. We were a WEB3 Creatives platform
                    specializing in NFTs and Metaverse development.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="resume-row">
            <div className="row">
              <div className="col-sm-3 col-md-3 col-xl-2">
                <div className="rb-left">
                  <img src="static/img/android.png" title="" alt="" />
                </div>
              </div>
              <div className="col-sm-9 col-md-9 col-xl-10">
                <div className="rb-right">
                <h6>Android Developer</h6>
                  <label>Echelon | Remote | Jul 2021 - Oct 2021</label>
                  <div className="rb-time">Intern</div>
                  <p>
                    As an internship program participant, I was responsible for
                    developing and maintaining the Android application for
                    Echelon's line of smart exercise equipment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
