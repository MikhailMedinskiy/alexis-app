import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Popover } from 'antd';
import Logout from '../../Login/components/LogOut';

const Navigation = props => (
  <div className="top-navbar-wrapper">
    <Menu className="top-navbar" mode="horizontal" theme="dark">
      <Menu.Item id="logo" className="nav-item" />
      <Menu.Item className="nav-item">
        <Link to="/wordgroups">
          {'Word Groups'}
        </Link>
      </Menu.Item>
      <Menu.Item className="nav-item">
        <Link to="/setup">
          {'Setup'}
        </Link>
      </Menu.Item>
      <Menu.Item className="nav-item">
        <Link to="/statistics">
          {'Statistics'}
        </Link>
      </Menu.Item>
      <Menu.Item className="nav-item">
        <Link to="/profile">
          {'Profile'}
        </Link>
      </Menu.Item>
      <Menu.Item id="userIcon" className="nav-item">
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
      </Menu.Item>
    </Menu>
  </div>
);

const mapStateToProps = state => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProps)(Navigation);