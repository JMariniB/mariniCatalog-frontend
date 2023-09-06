import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd, BiUpload } from "react-icons/bi";

const menu = [
  {
    title: "Artículos",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Nuevo Artículo",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Artículos por CSV",
    icon: <BiUpload />,
    path: "/add-products",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
