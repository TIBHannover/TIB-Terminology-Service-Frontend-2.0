import { TextInputProps, TextAreaProps } from "./types";


export const TextInput = (props: TextInputProps) => {
  const { placeholder, id, defaultValue, label, required, onchange } = props;
  return (
    <div className="row">
      <div className="col-sm-12">
        <label className={required ? "required_input" : ""} htmlFor={id}>{label}</label>
        <input
          type="text"
          className="form-control mb-4"
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onchange}
        />
      </div>
    </div>
  );
};


export const TextArea = (props: TextAreaProps) => {
  const { placeholder, id, defaultValue, label, required, onchange, rows } = props;
  return (
    <div className="row">
      <div className="col-sm-12">
        <label className={required ? "required_input" : ""} htmlFor={id}>{label}</label>
        <textarea
          className="form-control mb-4"
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onchange}
          rows={rows}
        ></textarea>
      </div>
    </div>
  );
};
