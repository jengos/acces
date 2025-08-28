import React, { createContext, useContext, useState } from "react";

interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  setValue: (name: string, value: any) => void;
  validateField: (name: string, rules?: any, value?: any) => boolean;
  validateAll: (fields: { name: string; rules?: any }[]) => boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpiar error al escribir
  };

  const validateField = (name: string, rules?: any, value?: any): boolean => {
    const fieldValue = value ?? values[name];
    let errorMsg = "";

    if (rules?.required?.value && !fieldValue) {
      errorMsg = rules.required.errormsg || "Este campo es obligatorio";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const validateAll = (fields: { name: string; rules?: any }[]): boolean => {
    let allValid = true;
    fields.forEach(({ name, rules }) => {
      const isValid = validateField(name, rules);
      if (!isValid) allValid = false;
    });
    return allValid;
  };

  return (
    <FormContext.Provider value={{ values, errors, setValue, validateField, validateAll }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext debe usarse dentro de un FormProvider");
  return ctx;
};
