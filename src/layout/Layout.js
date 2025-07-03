import { Fragment } from "react";
import ImageView from "../components/ImageView";
import DayNightMood from "./DayNightMood";
import Header from "./Header";
const Layout = ({ children }) => {
  return (
    <Fragment>
      <ImageView />
      {/* page loading */}
      {/* End */}
      {/* Header Start */}
      <Header />
      {/* Main Start */}
      <main className="main-left pp-main-section">{children}</main>
      <DayNightMood />
    </Fragment>
  );
};
export default Layout;
