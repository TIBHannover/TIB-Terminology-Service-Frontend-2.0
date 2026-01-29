

type SearchFacetProps = {
  data: Record<string, number>; // string is the facet field name and number is the count
  selectedFacetFields: string[];
  handleFacetFieldClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  idPrefix: string;
  disableCount?: boolean;
}

const SearchFacetBox = (props: SearchFacetProps) => {

  function render() {
    let result = [];
    for (let facetFieldName in props.data) {
      if (props.data[facetFieldName] === 0) {
        continue;
      }
      result.push(<FacetCheckBox key={facetFieldName} facetFieldName={facetFieldName} {...props} />);
    }
    return result;
  }

  return (
    <>
      {render()}
    </>
  );

}

export const FacetCheckBox = (props: SearchFacetProps & { facetFieldName: string }) => {
  const facetFieldName = props.facetFieldName;
  return (
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
      {!props.disableCount &&
        <div className="col-sm-3">
          <div className="facet-result-count">{props.data[facetFieldName]}</div>
        </div>
      }
    </div>
  );
}

export default SearchFacetBox;
