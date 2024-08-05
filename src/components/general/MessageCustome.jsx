import React, { useEffect } from "react";
import { message } from "antd";

const MessageCustome = ({ infoMessage }) => {
  const [messageApi, contextHolder] = message.useMessage();
  
  const showMessage = () => {
    const config = {
      content: infoMessage.messageContent,
     onClose: () => {
      },
    };
    if (infoMessage.action === "error") {
      messageApi.error(config);
    } else if (infoMessage.action === "success") {
      messageApi.success(infoMessage.messageContent);
    } else if (infoMessage.action === "warning") {
      messageApi.warning(infoMessage.messageContent);
    }
  };

  useEffect(() => {
    showMessage();
  }, [infoMessage, messageApi]);
  return <>{contextHolder}</>;
};

export default MessageCustome;