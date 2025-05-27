import { useContext } from "react";
import { AppContext } from "../../context/AppContext";



const TermSetList = () => {
  const appContext = useContext(AppContext);

  return (
    <>
      {appContext.userTermsets.map((tset) => {
        return (
          <div className="row">
            <div className="col-sm-12">
              {tset.name}
            </div>
          </div>
        )
      })

      }
    </>
  )
}

export default TermSetList;
