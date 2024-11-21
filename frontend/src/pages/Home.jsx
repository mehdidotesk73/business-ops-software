import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className='position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-dark'
      style={{ display: "block", color: "white" }}
    >
      <div className='col-md-5 p-lg-5 mx-auto my-5'>
        <h1 className='display-4 font-weight-normal'>
          Business Operations Support
        </h1>
        <p className='lead font-weight-normal'>
          Start building projects by clicking the link below
        </p>
        <button
          className='btn btn-primary'
          onClick={() => navigate("/projects")}
        >
          Get started
        </button>
      </div>
      <div className='product-device box-shadow d-none d-md-block'></div>
      <div className='product-device product-device-2 box-shadow d-none d-md-block'></div>
    </div>
  );
}

export default Home;
