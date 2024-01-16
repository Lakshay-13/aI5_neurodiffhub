import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

import { useAuthContext } from "../../../services/AuthService";
import styles from './styles';

const AdminMenu = (props) => {
  const { classes } = props;
  let { page } = props;

  console.log("================================== AdminMenu ======================================");

  // Get Auth Context
  const auth = useAuthContext();


  return (
    <div className={classes.adminMenuContainer}>
      <MenuList>
        <MenuItem selected={page == 'solutionsdashboard'} component={Link} to="/admin/solutionsdashboard">Solutions Dashboard</MenuItem>
        <Divider />
        <MenuItem selected={page == 'equations'} component={Link} to="/admin/equations">Equations</MenuItem>
        <Divider />
        <MenuItem selected={page == 'usecases'} component={Link} to="/admin/usecases">Use Cases</MenuItem>
        <Divider />
        <MenuItem selected={page == 'featuredsolutions'} component={Link} to="/admin/featuredsolutions">Featured Solutions</MenuItem>
        <Divider />
        <MenuItem selected={page == 'admins'} component={Link} to="/admin/admins">Manage Admins</MenuItem>
        <Divider />
      </MenuList>
    </div>
  );
};

export default withStyles(styles)(AdminMenu);