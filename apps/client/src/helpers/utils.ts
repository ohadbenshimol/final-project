import {message} from "antd";

export const shareClick = (link: string) => {
  if (navigator.share) {
    navigator.share({
      title: 'Only me',
      text: 'Join my event',
      files: [],
      url: link,
    });
  } else {
    message.error('Share not supported on this browser, do it manually!');
  }
};

export const setMessage =  (text: string, type: 'success' | 'error' | 'warning') => {
  if (type === 'success') {
    message.success(text)
  } else if (type === "error") {
    message.error(text)
  } else {
    message.warning(text)
  }
}
