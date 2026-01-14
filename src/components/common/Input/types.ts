
export type TextInputProps = {
  placeholder: string,
  id: string,
  defaultValue: string,
  label: string,
  required?: boolean,
  onchange: (e: React.ChangeEvent) => void
}


export type TextAreaProps = TextInputProps & {
  rows?: number
}
