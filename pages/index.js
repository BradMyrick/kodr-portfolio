import dynamic from "next/dynamic";
import About from "../src/components/About";
import Contact from "../src/components/Contact";
import ParticlesBackground from "../src/components/ParticlesBackground";
import Services from "../src/components/Services";
import Layout from "../src/layout/Layout";
import TypingAnimation from "../src/components/TypingAnimation";

const Portfolio = dynamic(() => import("../src/components/Portfolio"), {
  ssr: false,
});
const IndexParticles = () => {
  return (
    <Layout>
      <section
        id="home"
        data-nav-tooltip="Home"
        className="pp-section pp-scrollable"
      >
        <div className="home-banner">
          {/* <div id="particles-box" className="particles" /> */}
          <ParticlesBackground />
          <div className="container">
            <div className="row full-screen align-items-center">
              <div className="col-lg-6">
                <div className="type-box">
                  <h6> GM, I'm</h6>
                  <h1 className="font-alt">Brad 'kodr.eth' Myrick</h1>
                  <p className="lead">
                   <TypingAnimation />
                  </p>
                  <p className="desc">
                    I am a seasoned software engineer with a background in Web3, Blockchain, and Systems Architecture. My engineering journey has led me to develop cutting-edge solutions for some of the world's most ambitious businesses. Contact me to bring your ideas to life and push the boundaries of what's possible.</p>
                  <div className="btn-bar">
                    <a className="px-btn px-btn-theme" href="#contactme">
                      Contact Me
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hb-img">
                  <img src="static/img/home-banner.png" title="" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Home */}
      {/* about us */}
      <About />
      {/* End about us */}
      {/* Services */}
      <Services />
      {/* End Services */}
      {/* Portfolio */}
      <Portfolio />
      {/* End Portfolio */}
      {/* Contact us */}
      <Contact />
    </Layout>
  );
};
export default IndexParticles;
