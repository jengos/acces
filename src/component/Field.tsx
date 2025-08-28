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
  const id = `${name}-1`;
  const errorId = `${name}-error`;

  return (
    <FormGroup>
      <Label for={id}>
        {label} {rules?.required?.value && <span className="text-danger" aria-hidden="true">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={values[name] || ""}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={() => validateField(name, rules)}
        invalid={!!errors[name]}
        aria-invalid={!!errors[name]}
        aria-required={!!rules?.required?.value}
        aria-describedby={errors[name] ? errorId : undefined}
      />
      {errors[name] && (
        <FormFeedback id={errorId} role="alert">
          {errors[name]}
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default Field;
