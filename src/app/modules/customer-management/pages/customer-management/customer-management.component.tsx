/* eslint-disable react/jsx-no-useless-fragment */
import { Container } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageName } from 'shared/const/drawer.const';
import CustomerInfo from '../../components/customer-info/customer-info.component';
import HotlineGroup from '../../components/hotline-group/hotline-group.component';
import VirtualGroup from '../../components/virtual-group/virtual-group.component';
import './customer-management.style.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tab-${index}`}
      aria-labelledby={`customer-tabpanel-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.defaultProps = {
  children: null,
};

function a11yProps(index: number) {
  return {
    id: `customer-tab-${index}`,
    'aria-controls': `customer-tabpanel-${index}`,
  };
}

function CustomerManagement() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title>{PageName.CUSTOMER_MANAGEMENT}</title>
      </Helmet>

      <Container maxWidth="xl" className="customer-management">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Khách hàng" {...a11yProps(0)} />
          <Tab label="Số Hotline" {...a11yProps(1)} />
          <Tab label="Số Virtual" {...a11yProps(2)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <CustomerInfo />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <HotlineGroup />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <VirtualGroup />
        </TabPanel>
      </Container>
    </>
  );
}

export default CustomerManagement;
