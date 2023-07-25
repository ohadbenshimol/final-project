import UploadButton, { asUploadButton } from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import UploadPreview from '@rpldy/upload-preview';
import retryEnhancer, {useRetry} from '@rpldy/retry-hooks';
import {FC, memo, useCallback, useRef, useState} from 'react';
import {composeEnhancers} from '@rpldy/uploader';
import {getMockSenderEnhancer} from '@rpldy/mock-sender';
import {ArrowLeftOutlined, CloudUploadOutlined, DeleteOutlined, RedoOutlined, StopOutlined} from '@ant-design/icons';
import {SERVER_URL} from '../../helpers/config';
import {AddImagesToEvent} from '../../helpers/requests';
import {get, ref} from 'firebase/database';
import {db} from '../../helpers/firebase';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import Uploady, {
  useAbortItem,
  useBatchStartListener,
  useItemAbortListener,
  useItemFinalizeListener,
  useItemProgressListener,
} from '@rpldy/uploady';
import {Button, Card, Col, Layout, Modal, ModalFuncProps, Progress, Row,} from 'antd';
import './FileUploader.less';
import {useNavigation} from '../../hooks/navigate';
import defaultImg from "../../assets/default.svg";
import {Image} from "semantic-ui-react";

const STATES = {
  PROGRESS: 'PROGRESS',
  DONE: 'DONE',
  ABORTED: 'ABORTED',
  ERROR: 'ERROR',
};

const isItemError = (state: any) =>
  state === STATES.ABORTED || state === STATES.ERROR;

const PreviewCard = memo(({id, url, name}: any) => {
  const [percent, setPercent] = useState(0);
  const [itemState, setItemState] = useState(STATES.PROGRESS);
  const abortItem = useAbortItem();
  const retry = useRetry();

  useItemProgressListener((item) => {
    setPercent(item.completed);
  }, id);

  useItemFinalizeListener((item) => {
    setItemState(
      item.state === 'finished'
        ? STATES.DONE
        : item.state === 'aborted'
          ? STATES.ABORTED
          : STATES.ERROR
    );
  }, id);

  useItemAbortListener(() => {
    setItemState(STATES.ABORTED);
  }, id);

  const onAbort = useCallback(() => {
    abortItem(id);
  }, [abortItem, id]);

  const onRetry = useCallback(() => {
    retry(id);
  }, [retry, id]);

  return (
    <Col>
      <Card
        hoverable
        style={{width: 240}}
        cover={<div
          className="image-container"
          style={{
            position: 'relative',
            overflow: 'hidden',
            maxHeight: '18em',
            width: '100%',
          }}
        >
          <div
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${
                url || defaultImg
              })`,
              filter: 'blur(10px)',
            }}
          />
          <Image
            style={{
              position: 'relative',
              maxHeight: '18em',
              objectFit: 'contain',
              zIndex: 1,
              margin: 'auto',
            }}
            className="Sad"
            src={url || defaultImg}
            fluid
            ui={false}
          />
        </div>}
        actions={[
          <Button
            key="stop"
            icon={<StopOutlined rev />}
            onClick={onAbort}
            disabled={itemState !== STATES.PROGRESS}
            type="link"
          />,
          <Button
            key="retry"
            icon={<RedoOutlined rev />}
            onClick={onRetry}
            disabled={!isItemError(itemState)}
            type="link"
          />,
        ]}
      >
        <Card.Meta
          title={name}
          description={
            <Progress
              type="dashboard"
              percent={percent}
              size={66}
              strokeColor={
                isItemError(itemState)
                  ? '#FF4D4F'
                  : {
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }
              }
              status={isItemError(itemState) ? 'exception' : undefined}
            />
          }
        />
      </Card>
    </Col>
  );
});

const UploadPreviewCards = ({ previewMethodsRef, setPreviews }: any) => {
  const getPreviewProps = useCallback(
    (item: any) => ({id: item.id, name: item.file.name}),
    []
  );

  return (
    <Row gutter={2} justify="center" className="preview-row">
      <UploadPreview
        previewComponentProps={getPreviewProps}
        PreviewComponent={PreviewCard}
        onPreviewsChanged={setPreviews}
        previewMethodsRef={previewMethodsRef}
        rememberPreviousBatches
      />
    </Row>
  );
};

const DragAndDrop: FC = () => {
  return (
    <UploadButton className="drag">
      <UploadDropZone
        onDragOverClassName="drag-over"
        grouped
        maxGroupSize={100}
        autoUpload={false}
      >
        <span>Drag&amp;Drop File(s) Here</span>
      </UploadDropZone>
    </UploadButton>
  );
};

const DragAndClickUpload = asUploadButton(DragAndDrop);

const UploadUi: FC<{ eventId: string }> = ({eventId}) => {
  const {goToMyEventsPage} = useNavigation();
  const previewMethodsRef = useRef();
  const [previews, setPreviews] = useState([]);

  const onClearPreviews = useCallback(() => {
    (previewMethodsRef.current as any)?.clear();
  }, [previewMethodsRef]);

  useBatchStartListener((batch) => {
    const promises = batch.items.map((item) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result as string);
        };
        reader.onerror = reject;

        reader.readAsDataURL(item.file as any);
      });
    });

    Promise.all(promises)
      .then(async (base64Array: string[]) => {
        console.log(base64Array);

        await AddImagesToEvent({eventId, images: base64Array});
      })
      .catch((error) => {
        console.error('Error reading files:', error);
      });
  });

  return (
    <div>
      <Layout
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Layout.Header
          style={{
            background: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <div className="button-container">
            <div className="button-wrapper">
              <Button
                icon={<ArrowLeftOutlined rev/>}
                size="large"
                onClick={goToMyEventsPage}
              >
                Back to events
              </Button>
            </div>
            <div className="button-wrapper">
              <Button
                type={"default"}
                icon={<CloudUploadOutlined rev/>}
                size={"large"}
                key={"upload-button"}
              >
                <UploadButton key="upload-button" />
              </Button>
            </div>
            <div className="button-wrapper">
              <Button
                key="clear-button"
                icon={<DeleteOutlined rev/>}
                size="large"
                disabled={!previews.length}
                onClick={onClearPreviews}
              >
                Clear
              </Button>
            </div>
          </div>

          <span style={{marginLeft: '2em'}} className={"total-images-text"}>
            Total images uploaded: {previews.length}
          </span>
        </Layout.Header>
        <Layout.Content>
          {!previews.length && <DragAndClickUpload key="upload-button" />}

          <UploadPreviewCards
            setPreviews={setPreviews}
            previewMethodsRef={previewMethodsRef}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
};

const mockEnhancer = getMockSenderEnhancer({delay: 2000});
const enhancer = composeEnhancers(retryEnhancer, mockEnhancer); //TODO=:USE UNTIL SERVER

const FileUploader = () => {
  const {eventId} = useParams();
  const {goToMyEventsPage} = useNavigation();

  const getEvent = async () => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    return snapshot.val();
  };

  useQuery('events', async () => await getEvent(), {
    onSuccess: (data) => {
      if (!data) Modal.error({...errorModalConf, onOk: goToMyEventsPage});
    },
  });

  return (
    <Uploady enhancer={enhancer} destination={{ url: SERVER_URL }}>
      <>{eventId && <UploadUi eventId={eventId} />}</>
    </Uploady>
  );
};

export default FileUploader;

const errorModalConf: ModalFuncProps = {
  title: 'This event does not exist',
  content: 'someone give you wrong id :(',
  okText: 'go to your events',
  okType: 'primary',
  centered: true,
  okButtonProps: {
    ghost: true,
  },
};
