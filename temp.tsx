import './EventForm.less';
import {FC} from "react";
import {Field, Form, useFormik} from "formik";
import * as Yup from 'yup';
import {makeStyles} from "@material-ui/core/styles";
import {Button, TextField} from "@material-ui/core";


export interface EventFormProps {
}


const schema = Yup.object({
    name: Yup.string().min(3).required('שדה חובה'),
    storage: Yup.number().required(),
    description: Yup.string(),

  }
)
const EventForm: FC<EventFormProps> = (props: EventFormProps) => {
  const useStyles = makeStyles((theme: any) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: theme.spacing(1),
    },
    formField: {
      margin: theme.spacing(1),
      width: "100%",
    },
    button: {
      margin: theme.spacing(2),
    },
  }));
  const classes = useStyles()
  const formik = useFormik({
    initialValues: {
      storage: '',
      name: '',
      description: ''
    },
    validationSchema: schema,
    validateOnMount: false,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Form className={classes.form} onSubmit={formik.handleSubmit}>
  <Field
    className={classes.formField}
  name="name"
  label="Name"
  as={TextField}
  error={formik.errors.name}
  helperText={formik.errors.name}
  />

  <Field
  className={classes.formField}
  name="description"
  label="Description"
  as={TextField}
  error={formik.errors.description && Boolean(formik.errors.description)}
  helperText={formik.errors.description && formik.errors.description}
  />
  {formik.errors.description}
  <Field
    className={classes.formField}
  name="storage"
  label="Storage"
  as={TextField}
  error={formik.errors.storage && Boolean(formik.errors.storage)}
  helperText={formik.errors.storage && formik.errors.storage}
  />
  <Button
  className={classes.button}
  type="submit"
  variant="contained"
  color="primary"
    >
    Create Event
  </Button>
  </Form>
);

}

export default EventForm;
