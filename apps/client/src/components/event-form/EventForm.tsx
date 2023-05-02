import './EventForm.less';
import {FC} from "react";
import {Form, Formik, useFormik} from "formik";
import * as Yup from 'yup';
import {makeStyles} from "@material-ui/core/styles";
import 'semantic-ui-css/semantic.min.css'
import {Button, Header} from "semantic-ui-react";

export interface EventFormProps {
}


const schema = Yup.object({
    name: Yup.string().min(3).required('שדה חובה'),
    storage: Yup.string().required(),
    description: Yup.string()
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
      console.log("asasd")
    },
  });
  return (
    <form className={classes.form + " my-form"}>
      <div className="form-row">
        <div className="form-group">
          <Header as='h3'>Name</Header>
          <div className="ui focus input">
            <input
              placeholder={"name..."}
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            className={classes.formField + " my-input-field"}
          /></div>

        </div>

        <div className="form-group">
          <Header as='h3'>description</Header>
          <div className="ui focus input">
            <input
              placeholder={"description..."}
              type="text"
              id="name"
              name="name"
              value={formik.values.description}
              className={classes.formField + " my-input-field"}
            />
          </div>
        </div>
        <div className="form-group">
          <Header as='h3'>storage</Header>
          <div className="ui focus input">
            <input
              placeholder={"storage..."}
              type="text"
              id="name"
              name="name"
              value={formik.values.storage}
              className={classes.formField + " my-input-field"}
            />
          </div>
        </div>
      </div>
      <div className="form-row">
        <div>
          <Button size='tiny' primary>Primary</Button>
          <Button size='tiny' secondary>Secondary</Button>
        </div>
      </div>
    </form>
  );

}

export default EventForm;
