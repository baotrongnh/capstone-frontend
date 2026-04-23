"use client"

import { Modal } from 'antd';

type ModalLoginRequiredProps = {
     isModalOpen: boolean
     setIsModalOpen: (isModalOpen: boolean) => void
     setAuthModalOpen: (isModalOpen: boolean) => void
}

export default function ModalLoginRequired({
     isModalOpen,
     setIsModalOpen,
     setAuthModalOpen,
}: ModalLoginRequiredProps) {
     const handleOk = () => {
          setIsModalOpen(false)
          setAuthModalOpen(true)
     }

     const handleCancel = () => {
          setIsModalOpen(false)
     }

     return (
          <Modal
               title="Yêu cầu đăng nhập"
               closable={{ 'aria-label': 'Custom Close Button' }}
               open={isModalOpen}
               onOk={handleOk}
               onCancel={handleCancel}
               centered
          >
               <p>Vui lòng đăng nhập để thực hiện chức năng này</p>
          </Modal>
     )
}
