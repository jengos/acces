import React from "react";
import { Button, Form } from "reactstrap";
import { useFormContext, FormProvider } from "./context/FormContext";
import Field from "./component/Field";

import CheckboxField from "./component/CheckboxField";
import { PasswordField } from "./component/PasswordField";

const ProfileFormInner: React.FC = () => {
  const { validateAll, values } = useFormContext();

  const fields = [
    { name: "firstName", rules: { required: { value: true, errormsg: "El nombre es obligatorio" } } },
    { name: "lastName",  rules: {} }, // opcional
    { name: "email",     rules: {
        required: { value: true, errormsg: "El correo es obligatorio" },
        email:    { value: true, errormsg: "Correo inválido" },
      }
    },
    { name: "password",  rules: {
        required:  { value: true, errormsg: "La contraseña es obligatoria" },
        minLength: { value: 6,    errormsg: "Mínimo 6 caracteres" },
        pattern:   { value: /\d/, errormsg: "Debe incluir al menos un número" },
      }
    },
    { name: "accept",    rules: { required: { value: true, errormsg: "Debes aceptar los términos" } } },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = validateAll(fields);
    console.log("¿Formulario válido?:", ok);
    console.log("Valores:", values);
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Field name="firstName" label="Nombre" rules={fields[0].rules} />
      <Field name="lastName"  label="Apellido (opcional)" rules={fields[1].rules} />
      <Field name="email"     label="Correo" type="email" rules={fields[2].rules} />
      <PasswordField name="password" label="Contraseña" />
      <CheckboxField name="accept" label="Acepto los términos y condiciones" rules={fields[4].rules} />
      <Button type="submit" color="primary" className="mt-3">Guardar</Button>
    </Form>
  );
};

const ProfileForm: React.FC = () => (
  <FormProvider>
    <div className="container mt-4">
      <h3>Editar Perfil</h3>
      <ProfileFormInner />
    </div>
  </FormProvider>
);

export default ProfileForm;
