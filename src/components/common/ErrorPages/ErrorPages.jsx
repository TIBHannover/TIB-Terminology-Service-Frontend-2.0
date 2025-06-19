import React from "react";


export const NotFoundErrorPage = () => {
  return (
    <div className="row">
      <div className="col-sm-12 text-center bg-white text-danger">
        <h5>We cannot find your requested object.</h5>
      </div>
    </div>
  );
}

export const GeneralErrorPage = () => {
  return (
    <div className="row">
      <div className="col-sm-12 text-center bg-white text-danger">
        <h5>Something went wrong. Please try later.</h5>
      </div>
    </div>
  );
}