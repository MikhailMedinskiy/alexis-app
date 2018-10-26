import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Popover, Icon } from 'antd';
import Logout from '../../Login/components/LogOut';

const logo = '/images/logo.png';

const Navigation = props => (
  <div className="top-navbar-wrapper">
    <div className="top-container">
      <div id="logo">
        <img src={logo} alt="Alexis" />
      </div>
      <Menu className="top-navbar" mode="horizontal" theme="dark">
        <Menu.Item className="nav-item">
          <Link to="/wordgroups">
            <Icon type="global" theme="outlined" />
            {'Word Groups'}
          </Link>
        </Menu.Item>
        <Menu.Item className="nav-item">
          <Link to="/setup">
            <Icon id="setup-text-icon" type="setting" theme="outlined" />
            {'Setup'}
          </Link>
        </Menu.Item>
        <Menu.Item className="nav-item">
          <Link to="/statistics">
            <Icon type="bar-chart" theme="outlined" />
            {'Statistics'}
          </Link>
        </Menu.Item>
        <Menu.Item className="nav-item">
          <Link to="/profile">
            <Icon type="user" theme="outlined" />
            {'Profile'}
          </Link>
        </Menu.Item>
      </Menu>
      <div id="userIcon">
        <Icon id ="logout-icon" type="export" theme="outlined" />
        <Popover
          content={(
            <div className="logout-wrapper">
              <Logout />
            </div>
            )}
          trigger="click"
        >
          {props.userInfo.name}
        </Popover>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProps)(Navigation);
