import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-center">
          <div className="mr-10">
            <FaSquareInstagram />
          </div>
          <div className="mr-10">
            <FaFacebook />
          </div>
          <div>
            <SiGmail />
          </div>
        </div>
        <div>
          <div className="mt-3 ml-5">나만의 레시피</div>
          <div className="mt-3  font-bold">Choe Seon Jeong</div>
        </div>
      </div>
    </>
  );
}
