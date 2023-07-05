import QRCode from 'react-qr-code';
import { FC, useRef } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import {
  EmailIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import {
  EmailShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
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
              <input
                disabled
                type="text"
                value={link}
                readOnly
                ref={inputRef}
              />
            </Form.Field>
            <div
              style={{
                height: 'auto',
                margin: '0 auto',
                maxWidth: 64,
                width: '100%',
              }}
            >
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={link}
                viewBox={`0 0 256 256`}
              />
            </div>
            <Button onClick={handleCopyClick}>Copy Link</Button>
            <EmailShareButton url={link}>
              <EmailIcon />
            </EmailShareButton>
            <WhatsappShareButton url={link}>
              <WhatsappIcon />
            </WhatsappShareButton>
            <TwitterShareButton url={link}>
              <TwitterIcon />
            </TwitterShareButton>
            <TelegramShareButton url={link}>
              <TelegramIcon />
            </TelegramShareButton>
          </Form>
        </Modal.Content>
      </Modal.Content>
    </>
  );
};
