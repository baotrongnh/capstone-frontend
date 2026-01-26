import { Button } from "antd";

export default function Header() {
     return (
          <header className="container flex px-2">
               <div>
                    LOGO
               </div>
               <ul className="flex">
                    <li>Tìm căn hộ</li>
                    <li>Căn hộ của bạn</li>
                    <li>Hóa đơn</li>
                    <li>Hỗ trợ</li>
               </ul>
               <div>
                    <Button shape="round" type="primary">Trở thành đối tác</Button>
               </div>
          </header>
     )
}
