

type SearchFacetProps = {
  data: Record<string, number>; // string is the facet field name and number is the count
  selectedFacetFields: string[];
  handleFacetFieldClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  idPrefix: string;
}

const SearchFacetBox = (props: SearchFacetProps) => {

  function render() {
    let result = [];
    for (let facetFieldName in props.data) {
      result.push(
        <div className="row facet-item-row" key={facetFieldName}>
          <div className='col-sm-9'>
            <div className="form-check">
              <input
                className={"form-check-input " + (props.className ?? "")}
                type="checkbox"
                value={facetFieldName}
                id={props.idPrefix + facetFieldName}
                key={facetFieldName}
                onClick={props.handleFacetFieldClick}
                checked={props.selectedFacetFields.includes(facetFieldName)}
                onChange={() => { }}
              />
              <label className="form-check-label" htmlFor={props.idPrefix + facetFieldName}>
                {facetFieldName}
              </label>
            </div>
          </div>
          <div className='col-sm-3'>
            <span className="facet-result-count" id={"result-count-" + facetFieldName}>{props.data[facetFieldName]}</span>
          </div>
        </div>
      );
    }
    return result;
  }

  return (
    <>
      {render()}
    </>
  );

}

export default SearchFacetBox;
