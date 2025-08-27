import React from "react";
import { Button, Container, Form } from "reactstrap";
import { useFormContext, FormProvider } from "./context/FormContext";
import Field from "./component/Field";
import CheckboxField from "./component/CheckboxField";


const MyForm: React.FC = () => {
  const { values, validateAll } = useFormContext();

  const fields = [
    {
      name: "email",
      rules: {
        required: { value: true, errormsg: "El correo es obligatorio" },
        email: { value: true, errormsg: "Formato de correo inválido" },
      },
    },
    {
      name: "password",
      rules: {
        required: { value: true, errormsg: "La contraseña es obligatoria" },
        minLength: { value: 6, errormsg: "Mínimo 6 caracteres" },
      },
    },
    {
      name: "terms",
      rules: {
        required: { value: true, errormsg: "Debes aceptar los términos" },
      },
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll(fields)) {
      console.log("✅ Datos válidos:", values);
    } else {
      console.log("❌ Hay errores en el formulario");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field
        name="email"
        label="Correo"
        type="email"
        rules={fields[0].rules}
      />
      <Field
        name="password"
        label="Contraseña"
        type="password"
        rules={fields[1].rules}
      />
 <CheckboxField name="terms" label="Acepto los términos" rules={fields[2].rules} />
      <Button color="primary" type="submit">
        Enviar
      </Button>
    </Form>
  );
};

const App: React.FC = () => (
  <Container className="mt-5">
    <h2>Formulario accesible con Reactstrap</h2>
    <FormProvider>
      <MyForm />
    </FormProvider>
  </Container>
);

export default App;
