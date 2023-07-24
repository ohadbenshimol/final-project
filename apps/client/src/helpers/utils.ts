import { message } from "antd";

export const shareClick = (link:string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Only me',
        text: 'Join my event',
        files:[],
        url: link,
      });
    } else {
        message.error('Share not supported on this browser, do it manually!');
    }
  };