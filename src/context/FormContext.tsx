import React, { createContext, useContext, useState } from "react";

type Values = { [key: string]: string };
type Errors = { [key: string]: string };

interface FormContextType {
  values: Values;
  errors: Errors;
  setValue: (name: string, value: string) => void;
  validateField: (name: string, rules: any) => boolean;
  validateAll: (fields: { name: string; rules: any }[]) => boolean;
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

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpiar error al escribir
  };

  const validateField = (name: string, rules: any, valueParam?: string): boolean => {
  const value = valueParam !== undefined ? valueParam : values[name] || "";
  let error = "";

  if (rules.required?.value && !value.trim()) {
    error = rules.required.errormsg || "Campo requerido";
  } else if (rules.email?.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      error = rules.email.errormsg || "Correo inválido";
    }
  } else if (rules.minLength?.value && value.length < rules.minLength.value) {
    error = rules.minLength.errormsg || `Mínimo ${rules.minLength.value} caracteres`;
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
    <FormContext.Provider value={{ values, errors, setValue, validateField, validateAll }}>
      {children}
    </FormContext.Provider>
  );
};
