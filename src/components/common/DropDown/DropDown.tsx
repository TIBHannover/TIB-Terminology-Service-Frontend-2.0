type DropDownOption = {
  label: string;
  value: string | number | boolean | undefined;
};

type DropDownProps = {
  mandatory?: boolean;
  options: DropDownOption[];
  dropDownId: string;
  containerClass?: string;
  dropDownTitle: string;
  dropdownClassName?: string;
  dropDownValue?: string | number | boolean;
  dropDownChangeHandler?: (event: any) => void;
  defaultValue?: string | number | boolean;
  defaultVaue?: string | number | boolean;
  tooltipText?: string;
};

const DropDown = (props: DropDownProps) => {
  const {
    mandatory,
    options,
    dropDownId,
    containerClass,
    dropDownTitle,
    dropdownClassName,
    dropDownValue,
    dropDownChangeHandler,
    defaultValue,
    defaultVaue,
    tooltipText,
  } = props;
  const resolvedDefaultValue = defaultValue ?? defaultVaue;

  let optionsRendered: JSX.Element[] = [];
  for (let item of options) {
    optionsRendered.push(
      <option value={String(item.value)} key={String(item.value)}>
        {item.label}
      </option>,
    );
  }

  return (
    <div
      className={"site-dropdown-container " + containerClass}
      title={tooltipText ?? ""}
    >
      <label
        htmlFor={dropDownId}
        className={"col-form-label " + (mandatory ? "required_input" : "")}
      >
        {dropDownTitle}
      </label>
      <select
        className={"site-dropdown-menu " + dropdownClassName}
        id={dropDownId}
        defaultValue={
          resolvedDefaultValue === undefined
            ? undefined
            : String(resolvedDefaultValue)
        }
        value={dropDownValue === undefined ? undefined : String(dropDownValue)}
        onChange={dropDownChangeHandler}
      >
        {optionsRendered}
      </select>
    </div>
  );
};

export default DropDown;
