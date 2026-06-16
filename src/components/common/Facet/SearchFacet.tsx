type SearchFacetProps = {
  data: Record<string, number>; // string is the facet field name and number is the count
  selectedFacetFields: string[];
  handleFacetFieldClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  idPrefix: string;
  disableCount?: boolean;
};

const SearchFacetBox = (props: SearchFacetProps) => {
  function render() {
    let result = [];
    for (let facetFieldName in props.data) {
      if (props.data[facetFieldName] === 0) {
        continue;
      }
      result.push(
        <FacetCheckBox
          key={facetFieldName}
          facetFieldName={facetFieldName}
          {...props}
        />,
      );
    }
    return result;
  }

  return <>{render()}</>;
};

export const FacetCheckBox = (
  props: SearchFacetProps & { facetFieldName: string },
) => {
  const facetFieldName = props.facetFieldName;
  return (
    <label
      className="row facet-item-row facet-item-label"
      htmlFor={props.idPrefix + facetFieldName}
      key={facetFieldName}
    >
      <span className={props.disableCount ? "col-sm-12" : "col-sm-9"}>
        <span className="form-check mb-0">
          <input
            className={"form-check-input " + (props.className ?? "")}
            type="checkbox"
            value={facetFieldName}
            id={props.idPrefix + facetFieldName}
            key={facetFieldName}
            onClick={props.handleFacetFieldClick}
            checked={props.selectedFacetFields.includes(facetFieldName)}
            onChange={() => {}}
          />
          <span className="form-check-label facet-item-text">
            {facetFieldName}
          </span>
        </span>
      </span>
      {!props.disableCount && (
        <span className="col-sm-3">
          <span
            className="facet-result-count"
            id={"facet-count-" + facetFieldName}
          >
            {props.data[facetFieldName]}
          </span>
        </span>
      )}
    </label>
  );
};

export default SearchFacetBox;
