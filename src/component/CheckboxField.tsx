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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const newValue = checked ? "true" : "";
    setValue(name, newValue);
  };

  const handleBlur = () => {
    validateField(name, rules, values[name]);
  };

  const isChecked = values[name] === "true";

  return (
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          className={errors[name] ? "is-invalid" : ""}
        />
        {label}
        {rules?.required?.value && (
          <span className="text-danger" aria-hidden="true">
            {" *"}
          </span>
        )}
      </Label>
      {errors[name] && (
        <FormFeedback id={`${name}-error`} role="alert" style={{ display: "block" }}>
          {errors[name]}
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default CheckboxField;
