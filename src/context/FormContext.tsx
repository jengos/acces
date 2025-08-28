import React, { createContext, useContext, useState } from "react";

type Values = { [key: string]: any };
type Errors = { [key: string]: string };

interface FormContextType {
  values: Values;
  errors: Errors;
  setValue: (name: string, value: any) => void;
  validateField: (name: string, rules?: any, valueParam?: any) => boolean;
  validateAll: (fields: { name: string; rules: any }[]) => boolean;
  setInitialValues?: (data: Values) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext debe usarse dentro de FormProvider");
  return ctx;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  const setInitialValues = (data: Values) => {
    setValues(data);
    setErrors({});
  };

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpia el error al escribir
  };

  const isEmpty = (v: any) =>
    v === undefined || v === null ||
    (typeof v === "string" && v.trim() === "") ||
    (typeof v === "boolean" && v === false);

  const validateField = (name: string, rules?: any, valueParam?: any): boolean => {
    const value = valueParam !== undefined ? valueParam : values[name];
    let error = "";

    if (!error && rules?.required?.value && isEmpty(value)) {
      error = rules.required.errormsg || "Campo requerido";
    }

    if (!error && rules?.email?.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === "string" && value && !emailRegex.test(value)) {
        error = rules.email.errormsg || "Correo inválido";
      }
    }

    if (!error && rules?.minLength?.value) {
      if (typeof value === "string" && value.length < rules.minLength.value) {
        error = rules.minLength.errormsg || `Mínimo ${rules.minLength.value} caracteres`;
      }
    }

    if (!error && rules?.maxLength?.value) {
      if (typeof value === "string" && value.length > rules.maxLength.value) {
        error = rules.maxLength.errormsg || `Máximo ${rules.maxLength.value} caracteres`;
      }
    }

    if (!error && rules?.minValue?.value !== undefined) {
      const n = Number(value);
      if (!Number.isNaN(n) && n < rules.minValue.value) {
        error = rules.minValue.errormsg || `Mínimo ${rules.minValue.value}`;
      }
    }

    if (!error && rules?.maxValue?.value !== undefined) {
      const n = Number(value);
      if (!Number.isNaN(n) && n > rules.maxValue.value) {
        error = rules.maxValue.errormsg || `Máximo ${rules.maxValue.value}`;
      }
    }

    if (!error && rules?.pattern?.value) {
      const re: RegExp =
        rules.pattern.value instanceof RegExp
          ? rules.pattern.value
          : new RegExp(rules.pattern.value);
      if (typeof value === "string" && value && !re.test(value)) {
        error = rules.pattern.errormsg || "Formato inválido";
      }
    }

    if (!error && typeof rules?.custom?.value === "function") {
      const ok = rules.custom.value(value, values);
      if (!ok) error = rules.custom.errormsg || "Valor inválido";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateAll = (fields: { name: string; rules: any }[]): boolean => {
    let isValid = true;
    fields.forEach((f) => {
      const ok = validateField(f.name, f.rules);
      if (!ok) isValid = false;
    });
    return isValid;
  };

  return (
    <FormContext.Provider value={{ values, errors, setValue, validateField, validateAll, setInitialValues }}>
      {children}
    </FormContext.Provider>
  );
};
