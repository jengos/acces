import React from "react";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";
import { useFormContext } from "../context/FormContext";


interface FieldProps {
  name: string;
  label: string;
  type?: string;
  rules: any;
}

const Field: React.FC<FieldProps> = ({ name, label, type = "text", rules }) => {
  const { values, errors, setValue, validateField } = useFormContext();
const uniqueId = name + "-1";
  return (
    <FormGroup>
      <Label for={uniqueId}>{label}</Label>
      <Input
        id={uniqueId}
        name={name}
        type={type}
        value={values[name] || ""}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={() => validateField(name, rules)}
        invalid={!!errors[name]} // bootstrap: borde rojo
      />
      {errors[name] && <FormFeedback>{errors[name]}</FormFeedback>}
    </FormGroup>
  );
};

export default Field;
