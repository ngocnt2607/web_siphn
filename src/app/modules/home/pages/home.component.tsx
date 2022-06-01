import { Typography } from '@mui/material';
import React from 'react';
import './home-page.style.scss';
import { Helmet } from 'react-helmet';
import { PageName } from 'shared/const/drawer.const';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>{PageName.HOME}</title>
      </Helmet>

      <div className="welcome">
        <Typography variant="h3">Chào mừng đến với web quản lý MNP</Typography>
      </div>
    </>
  );
}

export default HomePage;
