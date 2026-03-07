import { Modal } from 'antd';
import { redirect } from 'next/navigation';

export default function ModalLoginRequired({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (isModalOpen: boolean) => void }) {
     const handleOk = () => {
          setIsModalOpen(false)
          const redirectUrl = `/?openAuthModal=true&redirect=${encodeURIComponent(window.location.pathname)}`
          redirect(redirectUrl)
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
          >
               <p>Vui lòng đăng nhập để thực hiện chức năng này</p>
          </Modal>
     )
}
