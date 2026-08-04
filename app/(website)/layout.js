import Navbar from "../Navbar";

export default function websiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
