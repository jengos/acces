import React from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { useFormContext } from "../context/FormContext";

interface CheckboxFieldProps {
  name: string;
  label: string;
  rules?: { required?: { value: boolean; errormsg?: string } };
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label, rules }) => {
  const { values, errors, setValue, validateField } = useFormContext();
  const checked = values[name] === "true";
  const errorId = `${name}-error`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked ? "true" : "";
    setValue(name, newValue);
  };

  return (
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
          onBlur={() => validateField(name, rules, values[name])}
          aria-invalid={!!errors[name]}
          aria-required={!!rules?.required?.value}
          aria-describedby={errors[name] ? errorId : undefined}
          className={errors[name] ? "is-invalid" : ""}
        />
        {label} {rules?.required?.value && <span className="text-danger" aria-hidden="true">*</span>}
      </Label>
      {errors[name] && (
        <FormFeedback id={errorId} role="alert" style={{ display: "block" }}>
          {errors[name]}
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default CheckboxField;
