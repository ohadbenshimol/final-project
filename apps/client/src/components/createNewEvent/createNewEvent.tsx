import * as Yup from 'yup';
import React, {FC, useState} from 'react';
import {Button, message, Steps, theme, Upload, UploadProps} from 'antd';
import {Form} from 'semantic-ui-react';
import {
  CodeSandboxOutlined,
  FileImageOutlined,
  InboxOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import {push} from 'firebase/database';
import {eventsRef} from '../../helpers/firebase';
import {CLIENT_URL} from '../../helpers/config';
import {useSelector} from 'react-redux';
import {getUser} from '../../store/reducers/userSlice';
import {createEvent} from '../../helpers/requests';
import {ShareEvent} from '../shareEvent/ShareEvent';
import './createNewEvent.less';

export interface CreateEventProps {
  setCreateEventIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  current: number;
}

const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  imgUrl: '',
  isActive: false,
};
export const CreateNewEvent: FC<CreateEventProps> = ({
                                                       setCreateEventIsOpen,
                                                       setCurrent,
                                                       current,
                                                     }) => {
  const {Dragger} = Upload;
  const [formData, setFormValues] = useState(DEFAULT_FORM_DATA);
  const user = useSelector(getUser);
  const [link, setLink] = useState('');

  const {token} = theme.useToken();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      await eventSchema.validate(formData, {abortEarly: false});
      const date = new Date(Date.now());
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getFullYear().toString()}`;

      const newEventRef = push(eventsRef, {
        ...formData,
        creationDate: formattedDate,
        owner: user.id,
        subscribers: {
          [user.id!]: true,
        },
        isActive: true,
      });

      setLink(`${CLIENT_URL}/register-event/${newEventRef.key}`);
      setFormValues(DEFAULT_FORM_DATA);
      await createEvent({eventId: newEventRef.key!});
      next();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: any) => {
    const {name, value} = e.target;
    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleImageChange = (file: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString();
      // setImage(base64String || '');
      setFormValues((prevState) => {
        return {
          ...prevState,
          imgUrl: base64String!,
        };
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const propsUpload: UploadProps = {
    name: 'file',
    listType: 'picture-card',
    multiple: false,
    beforeUpload: (data) => {
      console.log(data);
      return false;
    },
    onChange(info) {
      handleImageChange(info.file as any);
      const {status} = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const steps = [
    {
      title: 'fill the details',
      content: (
        <>
          <div className={'yoel-temp'} style={{marginTop: 15}}>
            <Form.Field>
              <label htmlFor="nameID">Name</label>
              <input
                value={formData.name}
                className="ui  input"
                id="nameID"
                name="name"
                onChange={handleChange}
                type="text"
                placeholder="Enter the event name"
                required
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor={'descriptionId'}>Description</label>
              <input
                value={formData.description}
                id={'descriptionId'}
                name="description"
                onChange={handleChange}
                type="text"
                placeholder="description..."
              />
            </Form.Field>
          </div>
        </>
      ),
      icon: <img style={{width: "1.3em"}} src="../../assets/create-event-assets/report.png"/>,
    },
    {
      title: 'Upload an image',
      content: (
        <Form.Field className={'upload-image'}>
          <Dragger {...propsUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined rev={true}/>
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Choosing a picture is optional, we can choose a picture for you..
            </p>
          </Dragger>
        </Form.Field>
      ),
      icon: <img style={{width: "1.3em"}} src="../../assets/create-event-assets/icons8-image.gif"/>,
    },
    {
      title: 'Share event',
      content: <ShareEvent link={link}></ShareEvent>,
      icon: <ShareAltOutlined rev={undefined}/>,
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    icon: item.icon,
  }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
  };

  return (
    <>
      <Form>
        <Steps current={current} items={items}/>
        <div style={contentStyle}>{steps[current].content}</div>
        <div className={'buttons-footer'}>
          {current == 0 && (
            <Button
              type="default"
              onClick={() => next()}
              disabled={!(formData.name && formData.description)}
            >
              Next
            </Button>
          )}
          {current == 1 && (
            <Button type="default" onClick={() => handleSubmit()}>
              Create event
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="default"
              onClick={() => {
                setCreateEventIsOpen(false);
                message.success('Processing complete!').then();
                setCurrent(0);
              }}
            >
              Back to events
            </Button>
          )}
          {current > 0 && current != 2 && (
            <Button
              style={{margin: '0 8px'}}
              onClick={() => prev()}
              type={'default'}
            >
              Previous
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default CreateNewEvent;

export const eventSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  email: Yup.string().email(),
});
