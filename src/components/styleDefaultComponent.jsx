import styled from "styled-components";
import { Menu } from "antd";

export const StyledMenu = styled(Menu)`
  background: transparent !important;
  border-right: none !important;

  .ant-menu-item {
    color: #ffffff !important;
    font-weight: 500;
    margin: 4px 0;
    padding-left: 16px !important;
    border-radius: 8px;
  }

  .ant-menu-item:hover {
    background: rgba(122, 0, 245, 0.4) !important;
    color: #fff !important;
    box-shadow: 0 0 8px #7a00f5;
  }

  .ant-menu-item-selected {
    background: rgba(212, 0, 255, 0.5) !important;
    color: #fff !important;
    box-shadow: 0 0 12px #d400ff;
    font-weight: 600;
  }

  .ant-menu-submenu-title {
    color: #ffffff !important;
  }
`;
