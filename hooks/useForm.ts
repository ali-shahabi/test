import { useState, useCallback, ChangeEvent, FormEvent, useRef } from "react";
import * as yup from "yup";

type FormState = { [key: string]: any };

export const useForm = (initialState: FormState, schema: yup.Schema<any>) => {
  const formStateRef = useRef<FormState>(initialState);
  const [errors, setErrors] = useState<FormState>({});

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    formStateRef.current = {
      ...formStateRef.current,
      [event.target.name]: event.target.value,
    };
  }, []);

  console.count();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await schema.validate(formStateRef.current, { abortEarly: false });
      console.log(formStateRef.current);
      setErrors({});
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errorMessages = err.inner.reduce((errors: FormState, error) => {
          return { ...errors, [error.path as string]: error.message };
        }, {});
        setErrors(errorMessages);
      }
    }
  };

  return { formState: formStateRef.current, onChange, onSubmit, errors };
};
