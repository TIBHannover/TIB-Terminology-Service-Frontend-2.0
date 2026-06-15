import type { ChangeEvent } from "react";

type SwitchButtonProps = {
  id?: string;
  label?: string;
  smallText?: string;
  className: string;
  onChange?: (event: any) => void | Promise<void>;
  checked?: boolean;
  dataId?: string | number;
  inLine?: boolean;
};

const SwitchButton = (props: SwitchButtonProps) => {
  
  const {id, label, smallText, className, onChange, checked, dataId, inLine} = props;
  
  
  function handleSwitchChange(e: ChangeEvent<HTMLInputElement>) {
    let isChecked = e.target.checked;
    if (isChecked) {
      let allCollectionCheckboxes = document.getElementsByClassName(className);
      for (let checkbox of allCollectionCheckboxes) {
        const checkboxInput = checkbox as HTMLInputElement;
        if (checkboxInput.dataset.id !== e.target.dataset.id) {
          checkboxInput.checked = false;
        }
      }
    }
    onChange && onChange(e);
  }
  
  
  return (
    <div className={"form-switch" + (inLine ? " d-inline" : "")} key={"key_" + id}>
      <input
        className={"form-check-input " + className}
        type="checkbox"
        role="switch"
        id={id}
        data-id={dataId}
        onChange={handleSwitchChange}
        checked={checked}
      />
      <label className="form-check-label ms-2" htmlFor={id}>
        {label}&nbsp;
        {smallText && (<small>{smallText}</small>)}
      </label>
    </div>
  )
}

export default SwitchButton;
