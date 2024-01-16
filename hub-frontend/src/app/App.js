import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline
} from '@material-ui/core';
import './App.css';
import Theme from "./Theme";
import AppRoutes from "./AppRoutes";
import Content from "../common/Content";
import Header from "../common/Header";
import Footer from "../common/Footer";
import DataService from '../services/DataService';
import { AuthContextProvider } from '../services/AuthService';
import { EnumContextProvider } from '../services/EnumService';
import { NotificationContextProvider } from '../services/NotificationService';

const App = (props) => {

  console.log("================================== App ======================================");

  // Init Data Service
  DataService.Init();

  // Build App
  let view = (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={Theme}>
        <AuthContextProvider>
          <NotificationContextProvider>
            <EnumContextProvider>
              <Router basename="/">
                <Header></Header>
                <Content>
                  <AppRoutes />
                </Content>
                <Footer></Footer>
              </Router>
            </EnumContextProvider>
          </NotificationContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </React.Fragment>
  )

  // Return View
  return view
}

export default App;
