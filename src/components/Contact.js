import emailjs from "emailjs-com";
import { useState } from "react";
const Contact = () => {
  const [mailData, setMailData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { name, email, message, subject } = mailData;
  const [error, setError] = useState(null);
  const onChange = (e) =>
    setMailData({ ...mailData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    if (
      name.length === 0 ||
      email.length === 0 ||
      message.length === 0 ||
      subject.length === 0
    ) {
      setError(true);
      clearError();
    } else {
      emailjs
        .send(
          "service_seruhwu", // service id
          "template_21aw58z", // template id
          mailData,
          "Q3pccdLZhU-mZT7tQ" // public api
        )
        .then(
          (response) => {
            setError(false);
            clearError();
            setMailData({ name: "", email: "", message: "", subject: "" });
          },
          (err) => {
            console.log(err.text);
          }
        );
    }
  };
  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 2000);
  };
  return (
    <section
      id="contactme"
      data-nav-tooltip="Contact Me"
      className="pp-section pp-scrollable section dark-bg"
    >
      <div className="container">
        <div className="title">
          <h3>Get in touch.</h3>
        </div>
        <div className="row">
          <div className="col-lg-5 col-xl-4 m-15px-tb">
            <div className="contact-info">
              <h4>What&apos;s Next?</h4>
              <p>
                Reach out to me to discuss your project and how I can help you
                bring it to life.
              </p>
              <ul>
                <li className="media">
                  <i className="ti-map" />
                  <span className="media-body">
                    Decentralized, Worldwide
                  </span>
                </li>
                <li className="media">
                  <i className="ti-email" />
                  <span className="media-body">brad@kodr.pro</span>
                </li>
                <li className="media">
                  <i className="ti-mobile" />
                  <span className="media-body">+57 312 254-5540</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-7 col-xl-8 m-15px-tb">
            <div className="contact-form">
              <h4>Email</h4>
              <form id="contact-form" onSubmit={(e) => onSubmit(e)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        name="name"
                        onChange={(e) => onChange(e)}
                        value={name}
                        id="name"
                        placeholder="Name *"
                        className={`form-control ${
                          error ? (!name ? "invalid" : "") : ""
                        }`}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        name="email"
                        onChange={(e) => onChange(e)}
                        value={email}
                        id="email"
                        placeholder="Email *"
                        className={`form-control ${
                          error ? (!email ? "invalid" : "") : ""
                        }`}
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        name="subject"
                        onChange={(e) => onChange(e)}
                        value={subject}
                        id="subject"
                        placeholder="Subject *"
                        className={`form-control ${
                          error ? (!subject ? "invalid" : "") : ""
                        }`}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <textarea
                        name="message"
                        onChange={(e) => onChange(e)}
                        value={message}
                        id="message"
                        placeholder="Your message *"
                        rows={5}
                        className={`form-control ${
                          error ? (!message ? "invalid" : "") : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="send">
                      {/* <button
                        onSubmit={(e) => onSubmit(e)}
                        className="px-btn px-btn-theme"
                        type="button"
                        value="Send"
                      >
                        {" "}
                        send message
                      </button> */}
                      <input
                        className="px-btn px-btn-theme"
                        type="submit"
                        value="send message"
                      />
                    </div>
                    <span
                      id="suce_message"
                      className="text-success"
                      style={{
                        display:
                          error !== null ? (!error ? "block" : "none") : "none",
                      }}
                    >
                      Message Sent Successfully
                    </span>
                    <span
                      id="err_message"
                      className="text-danger"
                      style={{ display: "none" }}
                    >
                      Message Sending Failed
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-12">
            <div className="google-map">
              <div className="embed-responsive embed-responsive-21by9">
                <iframe
                  className="embed-responsive-item"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.937246932927!2d-75.5452556846542!3d10.423378392535319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef5d0f1e6f1294f%3A0x9e4b7e5f8b2a8a9!2sClock%20Tower!5e0!3m2!1sen!2sco!4v1647548483427!5m2!1sen!2sco"               
                  allowFullScreen=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;
