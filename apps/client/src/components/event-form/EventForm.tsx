import * as Yup from 'yup';
import { FC } from 'react';
import { useFormik } from 'formik';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Button, Header } from 'semantic-ui-react';
import './EventForm.less';

export interface EventFormProps {}

const EventForm: FC<EventFormProps> = ({}) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: theme.spacing(1),
    },
    formField: {
      margin: theme.spacing(1),
      width: '100%',
    },

    button: {
      margin: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const { values } = useFormik({
    initialValues: {
      storage: '',
      name: '',
      description: '',
    },
    validationSchema: schema,
    validateOnMount: false,
    onSubmit: (values) => {
      console.log('asasd');
    },
  });

  return (
    <form className={classes.form + ' my-form'}>
      <div className="form-row">
        <div className="form-group">
          <Header as="h3">Name</Header>
          <div className="ui focus input">
            <input
              placeholder={'name...'}
              type="text"
              id="name"
              name="name"
              value={values.name}
              className={classes.formField + ' my-input-field'}
            />
          </div>
        </div>

        <div className="form-group">
          <Header as="h3">description</Header>
          <div className="ui focus input">
            <input
              placeholder={'description...'}
              type="text"
              id="name"
              name="name"
              value={values.description}
              className={classes.formField + ' my-input-field'}
            />
          </div>
        </div>
        <div className="form-group">
          <Header as="h3">storage</Header>
          <div className="ui focus input">
            <input
              placeholder={'storage...'}
              type="text"
              id="name"
              name="name"
              value={values.storage}
              className={classes.formField + ' my-input-field'}
            />
          </div>
        </div>
      </div>
      <div className="form-row">
        <div>
          <Button size="tiny" primary>
            Primary
          </Button>
          <Button size="tiny" secondary>
            Secondary
          </Button>
        </div>
      </div>
    </form>
  );
};

const schema = Yup.object({
  name: Yup.string().min(3).required('שדה חובה'),
  storage: Yup.string().required(),
  description: Yup.string(),
});

export default EventForm;
