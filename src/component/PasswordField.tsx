import React, { useState } from "react";
import { Input, FormGroup, Label } from "reactstrap";
import { useFormContext } from "../context/FormContext";
import CheckboxField from "./CheckboxField";


interface Rule {
  msg: string;
  test: (value: string) => boolean;
}

interface PasswordFieldProps {
  name: string;
  label: string;
  required?: boolean;
}

const rules: Rule[] = [
  { msg: "Mínimo 6 caracteres", test: (val) => val.length >= 6 },
  { msg: "Debe incluir un número", test: (val) => /\d/.test(val) },
  { msg: "Debe incluir una mayúscula", test: (val) => /[A-Z]/.test(val) },
];

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  required = false,
}) => {
  const { values, setValue, errors, validateField } = useFormContext();
  const value = values[name] || "";
  const [touched, setTouched] = useState(false);

  // ⚡ obtenemos el estado de la casilla desde FormContext
  const showPassword = values[`${name}-show`] || false;

  const handleBlur = () => {
    setTouched(true);
    validateField(name, value, required);
  };

  return (
    <FormGroup>
      <Label for={name}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Label>
      <Input
        type={showPassword ? "text" : "password"} // <- alterna según el checkbox en contexto
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={handleBlur}
        aria-invalid={!!errors[name]}
        aria-describedby={`${name}-requirements`}
        className={errors[name] ? "is-invalid" : ""}
      />
{/* 👇 checkbox integrado al mismo contexto */}
      <CheckboxField
        name={`${name}-show`}
        label="Mostrar contraseña"
      />
      {/* lista de requisitos */}
      <ul
        id={`${name}-requirements`}
        style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}
      >
        {!touched && !errors[name] ? (
          <li style={{ color: "#555", display: "flex", alignItems: "center" }}>
            <span role="img" aria-label="info">
              ℹ️
            </span>
            <span style={{ marginLeft: 4 }}>La contraseña debe cumplir:</span>
          </li>
        ) : (
          rules.map((rule, i) => {
            const valid = rule.test(value);
            return (
              <li
                key={i}
                style={{
                  color: valid ? "green" : "red",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span role="img" aria-label={valid ? "valid" : "invalid"}>
                  {valid ? "✔️" : "❌"}
                </span>
                <span style={{ marginLeft: 4 }}>{rule.msg}</span>
              </li>
            );
          })
        )}
      </ul>

      

      {errors[name] && (
        <div
          className="invalid-feedback"
          role="alert"
          style={{ display: "block" }}
        >
          {errors[name]}
        </div>
      )}
    </FormGroup>
  );
};
