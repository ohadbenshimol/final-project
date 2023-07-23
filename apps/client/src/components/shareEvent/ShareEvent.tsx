// import QRCode from 'react-qr-code';// TODO remove
import { FC, useRef } from 'react';
import { Button, Modal } from 'semantic-ui-react';
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
      <Modal.Content
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ flex: '8' }}>
          <label style={{ fontWeight: 'bold', color: 'black' }}>Link</label>
          <div></div>
          <input
            style={{ width: '90%', marginTop: '1em' }}
            type="text"
            placeholder="Search..."
            disabled
            value={link}
            readOnly
            ref={inputRef}
          />
          <div className={'buttons-actions'} style={{ marginTop: 30 }}>
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
        </div>

        <div style={{ flex: '2' }}>
          <QRCode value={link} icon="../../assets/logo.png" errorLevel="H" />
        </div>
      </Modal.Content>
    </>
  );
};
