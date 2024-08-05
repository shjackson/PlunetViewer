import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useTranslations } from "next-intl";

const BtnModal = ({ btnAction, icon, validation }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');
  const t = useTranslations("BtrModal");
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = ({}) => {
    if (validation) {
      setModalText(modalText);
      setConfirmLoading(true);
      setTimeout(() => {
        btnAction();
        setOpen(false);
        setConfirmLoading(false);
      }, 1000);
    } else {
      setModalText(modalText);
      setOpen(false);
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button className="custom-button-active" onClick={showModal}>
        {icon}
      </Button>
      <Modal
        title={validation ? t("btn-modal-dl") : t("btn-modal-sr")}
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={t("btn-modal-ok-text")}
        cancelText={t("btn-modal-cancel-text")}
        className="custom-modal"
        footer={[
          <Button key="cancel" className="custom-button-inactive" onClick={handleCancel}>
            {t("btn-modal-cancel-text")}
          </Button>,
          <Button key="ok" className="custom-button-active" onClick={handleOk} loading={confirmLoading}>
            {t("btn-modal-ok-text")}
          </Button>,
        ]}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};
export default BtnModal;
