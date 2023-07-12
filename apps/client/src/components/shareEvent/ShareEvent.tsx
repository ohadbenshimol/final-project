// import QRCode from 'react-qr-code';
import { FC, useRef } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { WhatsappShareButton } from 'react-share';
import { toast } from 'react-toastify';
import { QRCode } from 'antd';

import './ShareEvent.less';

interface ShareEventProps {
  link: string;
}

export const ShareEvent: FC<ShareEventProps> = ({ link }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyClick = async () => {
    if (inputRef.current) {
      inputRef.current.select();
      await navigator.clipboard.writeText(inputRef.current.value);
      toast.success(`copy link successfully`);
    }
  };

  const shareClick = async () => {
    if (navigator.share) {
      navigator.share({
        title: 'Only me',
        text: 'Register my event',
        url: link,
      });
    } else {
      console.log('Share not supported on this browser, do it manually!');
    }
  };

  return (
    <>
      <Modal.Header>share your event</Modal.Header>
      <Modal.Content>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Link</label>
              <div className="d" style={{ display: 'flex' }}>
                <input
                  disabled
                  type="text"
                  value={link}
                  readOnly
                  ref={inputRef}
                />
                <Button onClick={handleCopyClick}>
                  <i className="copy outline icon"></i>
                </Button>
                <Button onClick={shareClick}>
                  <i className="share alternate icon"></i>
                </Button>
                <Button>
                  <WhatsappShareButton url={link}>
                    <i className="whatsapp icon"></i>
                  </WhatsappShareButton>
                </Button>
              </div>
            </Form.Field>
            <div
              style={{
                height: 'auto',
                margin: '0 auto',
                maxWidth: 64,
                width: '100%',
              }}
            >
              <QRCode value={link} icon="../../assets/logo.png" />
              {/* <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={link}
                viewBox={`0 0 256 256`}
              /> */}
            </div>
          </Form>
        </Modal.Content>
      </Modal.Content>
    </>
  );
};
