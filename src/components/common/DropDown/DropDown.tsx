import {ChangeEventHandler, ReactNode} from "react";

type DropDownValue = string | number | readonly string[] | undefined;

interface DropDownOption {
    value: string | number;
    label: ReactNode;
}

interface DropDownProps {
    mandatory?: boolean;
    options: DropDownOption[];
    dropDownId: string;
    containerClass?: string;
    dropDownTitle?: ReactNode;
    dropdownClassName?: string;
    dropDownValue?: DropDownValue;
    dropDownChangeHandler?: ChangeEventHandler<HTMLSelectElement>;
    defaultValue?: DropDownValue;
    tooltipText?: string;
}

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
        tooltipText
    } = props;

    const optionsRendered = options.map((item) => (
        <option value={item.value} key={item.value} defaultValue={defaultValue}>
            {item.label}
        </option>
    ));

    return (
        <div className={"site-dropdown-container " + (containerClass ?? "")} title={tooltipText ?? ""}>
            <label htmlFor={dropDownId} className={"col-form-label " + (mandatory ? "required_input" : "")}>
                {dropDownTitle}
            </label>
            <select
                className={"site-dropdown-menu " + (dropdownClassName ?? "")}
                id={dropDownId}
                defaultValue={defaultValue}
                value={dropDownValue}
                onChange={dropDownChangeHandler}
            >
                {optionsRendered}
            </select>
        </div>
    );
};

export default DropDown;
