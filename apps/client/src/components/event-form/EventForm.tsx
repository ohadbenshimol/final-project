import './EventForm.less';
import {FC} from "react";
import {Formik, useFormik} from "formik";
import * as Yup from 'yup';

export interface EventFormProps {
}


const schema = Yup.object({
    name: Yup.string().min(3).required('שדה חובה'),
    email: Yup.string().email("Invalid email").required(),
    description: Yup.string()
  }
)
const EventForm: FC<EventFormProps> = (props: EventFormProps) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      description: ''
    },
    validationSchema: schema,
    validateOnMount: false,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const yoel = {
    email: '',
    name: '',
    description: ''
  }
  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.errors.name}
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      {formik.errors.email}
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      {formik.errors.description}
      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="description"
        onChange={formik.handleChange}
        value={formik.values.description}
      />

      <button type="submit">Create event</button>
    </form>
  );

}

export default EventForm;
