import React from "react";
import { Button, Form } from "reactstrap";
import Field from "./component/Field";
import CheckboxField from "./component/CheckboxField";
import { FormProvider, useFormContext } from "./context/FormContext";


const ProfileFormInner = () => {
  const { validateAll, values } = useFormContext();

  const fields = [
    { name: "email", rules: { required: { value: true, errormsg: "El email es obligatorio" }, email: { value: true } } },
    { name: "name", rules: { required: { value: true, errormsg: "El nombre es obligatorio" }, minLength: { value: 3 } } },
    { name: "terms", rules: { required: { value: true, errormsg: "Debe aceptar los términos" } } },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll(fields);
    console.log("¿Formulario válido?", isValid);
    console.log("Datos:", values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="email" label="Correo electrónico" type="email" rules={fields[0].rules} />
      <Field name="name" label="Nombre completo" rules={fields[1].rules} />
      <CheckboxField name="terms" label="Acepto los términos" rules={fields[2].rules} />
      <Button type="submit" color="primary">Guardar</Button>
    </Form>
  );
};

const ProfileForm = () => (
  <FormProvider>
    <ProfileFormInner />
  </FormProvider>
);

export default ProfileForm;
