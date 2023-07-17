import { useState, useCallback, useRef, memo, FC } from 'react';
import Uploady, {
  useItemProgressListener,
  useItemFinalizeListener,
  useItemAbortListener,
  useAbortItem,
  useBatchStartListener,
} from '@rpldy/uploady';
import { composeEnhancers } from '@rpldy/uploader';
import UploadPreview from '@rpldy/upload-preview';
import { getMockSenderEnhancer } from '@rpldy/mock-sender';
import UploadButton, { asUploadButton } from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';

import retryEnhancer from '@rpldy/retry-hooks';
import { Button, Card, Col, Row, Progress, Layout } from 'antd';
import { StopOutlined, RedoOutlined, DeleteOutlined } from '@ant-design/icons';
import { SERVER_URL } from '../../helpers/config';
import './FileUploader.less';

const STATES = {
  PROGRESS: 'PROGRESS',
  DONE: 'DONE',
  ABORTED: 'ABORTED',
  ERROR: 'ERROR',
};

const isItemError = (state: any) =>
  state === STATES.ABORTED || state === STATES.ERROR;

const PreviewCard = memo(({ id, url, name }: any) => {
  const [percent, setPercent] = useState(0);
  const [itemState, setItemState] = useState(STATES.PROGRESS);

  const abortItem = useAbortItem();
  // const retry = useRetry();

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

  // const onRetry = useCallback(() => {
  //   retry(id);
  // }, [retry, id]);

  return (
    <Col>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src={url} />}
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
            // onClick={onRetry}
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
    (item: any) => ({ id: item.id, name: item.file.name }),
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

const AA: FC = () => {
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
const UploadButton2 = asUploadButton(AA);

const UploadUi = () => {
  const previewMethodsRef = useRef();
  const [previews, setPreviews] = useState([]);

  const onClearPreviews = useCallback(() => {
    (previewMethodsRef.current as any)?.clear();
  }, [previewMethodsRef]);

  useBatchStartListener((batch) => {
    console.log(batch.items);
  });

  return (
    <Layout>
      <Layout.Header
        style={{
          background: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <div
          className="d"
          style={{
            background: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Button
            key="clear-button"
            icon={<DeleteOutlined rev />}
            size="large"
            disabled={!previews.length}
            onClick={onClearPreviews}
          >
            Clear
          </Button>
          <span style={{ marginLeft: '2em' }}>
            total images: {previews.length}
          </span>
        </div>
      </Layout.Header>
      <Layout.Content>
        {!previews.length && <UploadButton2 key="upload-button" />}

        <UploadPreviewCards
          setPreviews={setPreviews}
          previewMethodsRef={previewMethodsRef}
        />
      </Layout.Content>
    </Layout>
  );
};

const mockEnhancer = getMockSenderEnhancer({ delay: 2000 });
const enhancer = composeEnhancers(retryEnhancer, mockEnhancer);
// const enhancer = composeEnhancers(mockEnhancer); //TODO=:USE UNTIL SERVER

const FileUploader = () => {
  return (
    <Uploady enhancer={enhancer} destination={{ url: SERVER_URL }}>
      <UploadUi />
    </Uploady>
  );
};
// const FileUploader = () => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   const handleCancel = () => setPreviewOpen(false);
//   const [uploading, setUploading] = useState(false);

//   const getBase64 = (file: RcFile): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });

//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as RcFile);
//     }

//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//     setPreviewTitle(
//       file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
//     );
//   };

//   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
//     setFileList(newFileList);

//   const uploadButton = (
//     <div>
//       <PlusOutlined rev={undefined} />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   );

//   const handleUpload = () => {
//     const formData = new FormData();
//     fileList.forEach((file) => {
//       formData.append('files[]', file as RcFile);
//     });
//     setUploading(true);
//     // You can use any AJAX library you like
//     fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then(() => {
//         setFileList([]);
//         message.success('upload successfully.');
//       })
//       .catch(() => {
//         message.error('upload failed.');
//       })
//       .finally(() => {
//         setUploading(false);
//       });
//   };

//   const props: UploadProps = {
//     onRemove: (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);
//       setFileList(newFileList);
//     },
//     beforeUpload: (file) => {
//       setFileList([...fileList, file]);

//       return false;
//     },
//     fileList,
//   };

//   return (
//     <>
//       <Upload
//         {...props}
//         listType="picture-card"
//         multiple
//         fileList={fileList}
//         onPreview={handlePreview}
//         onChange={handleChange}
//       >
//         {fileList.length >= 1000 ? null : uploadButton}
//       </Upload>
//       <Button
//         type="primary"
//         onClick={handleUpload}
//         disabled={fileList.length === 0}
//         loading={uploading}
//         style={{
//           marginTop: 16,
//           // background: 'var(--main-color)',
//           color: 'white',
//         }}
//       >
//         {uploading ? 'Uploading' : 'Start Upload'}
//       </Button>
//       <Modal open={previewOpen} title={previewTitle} onCancel={handleCancel}>
//         <img alt="example" style={{ width: '100%' }} src={previewImage} />
//       </Modal>
//     </>
//   );
// };

export default FileUploader;
