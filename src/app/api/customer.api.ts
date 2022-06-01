/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';

export interface CustomerList {
  customers: CustomerInfo[];
}

export interface CustomerInfo {
  id: number;
  customerName: string;
  description: string;
  status?: number;
}

export interface CreateCustomerParams {
  customerName: string;
  description: string;
}

export interface GroupHotlineList {
  hotlineGroups: HotlineGroups[];
}

export interface HotlineGroups {
  hotlineGroupId: number;
  hotlineGroupName: string;
  customerId: number;
  customerDisplayName: string;
  customerName: string;
  groupStatus: number;
  hotlines: Hotline[];
}

export interface Hotline {
  isdn: string;
  status: number;
  hotlineId: string;
}

interface CreateGroupHotlineInfo {
  customerId: number;
  groupHotlineName: string;
  isdns: string[];
}

interface CreateVirtualNumberGroup {
  customerId: number;
  vngName: string;
  isdns: string[];
}

export interface GroupVirtualList {
  virtualNumberGroups: VirtualNumberGroup[];
}

export interface VirtualNumberGroup {
  vngId: number;
  vngName: string;
  isdn: string;
  status: number;
  customerId: number;
  customerName: string;
  customerDisplayName: string;
  virtualNumbers: VirtualNumber[];
}

export interface VirtualNumber {
  isdn: string;
  status: number;
  vnId: string;
}

interface UpdateHotlineGroup {
  customerId: number;
  hotlineGroupId: number;
  hotlineGroupName?: string;
  status?: number;
  isdns?: string[];
}

interface UpdateVirtualGroup {
  customerId: number;
  vngId: number;
  vngName?: string;
  status?: number;
  isdns?: string[];
}

export default class CustomerAPI {
  // Customer
  static getListCustomer = () => {
    return httpService.get<CustomerList>('/customer');
  };

  static createCustomer = (params: CreateCustomerParams) => {
    return httpService.post<CustomerInfo>('/customer', {
      body: params,
    });
  };

  static updateCustomer = (params: CustomerInfo) => {
    const { id, ...rest } = params;
    return httpService.put<CustomerInfo>(`/customer/${id}`, {
      body: { ...rest },
    });
  };

  // Hotline
  static getListGroupHotline = () => {
    return httpService.get<GroupHotlineList>('/hotline');
  };

  static getHotlineDetail = (customerId: string, groupHotlineId: string) => {
    return httpService.get<GroupHotlineList>(
      `/customer/${customerId}/hotline-group/${groupHotlineId}`
    );
  };

  static createGroupHotline = (params: CreateGroupHotlineInfo) => {
    const { customerId, ...rest } = params;
    return httpService.post(`/customer/${customerId}/hotline-group`, {
      body: { ...rest },
    });
  };

  static updateHotlineGroup = (params: UpdateHotlineGroup) => {
    const { customerId, hotlineGroupId, ...rest } = params;
    return httpService.put(
      `/customer/${customerId}/hotline-group/${hotlineGroupId}`,
      {
        body: { ...rest },
      }
    );
  };

  static addHotline = (params: UpdateHotlineGroup) => {
    const { customerId, hotlineGroupId, ...rest } = params;
    return httpService.post(
      `/customer/${customerId}/hotline-group/${hotlineGroupId}`,
      {
        body: { ...rest },
      }
    );
  };

  static changeActiveHotline = (hotlineId: string, status: number) => {
    return httpService.put(`/hotline/${hotlineId}`, {
      body: {
        status,
      },
    });
  };

  // Virtual
  static getListVirtual = () => {
    return httpService.get<GroupVirtualList>('/virtual-number');
  };

  static getVirtualDetail = (customerId: string, virtualGroupId: string) => {
    return httpService.get<GroupVirtualList>(
      `/customer/${customerId}/virtual-number-group/${virtualGroupId}`
    );
  };

  static createGroupVirtual = (params: CreateVirtualNumberGroup) => {
    const { customerId, ...rest } = params;
    return httpService.post(`/customer/${customerId}/virtual-number-group`, {
      body: { ...rest },
    });
  };

  static updateVirtualGroup = (params: UpdateVirtualGroup) => {
    const { customerId, vngId, ...rest } = params;
    return httpService.put(
      `/customer/${customerId}/virtual-number-group/${vngId}`,
      {
        body: { ...rest },
      }
    );
  };

  static addVirtualNumber = (params: UpdateVirtualGroup) => {
    const { customerId, vngId, ...rest } = params;
    return httpService.post(
      `/customer/${customerId}/virtual-number-group/${vngId}`,
      {
        body: { ...rest },
      }
    );
  };

  static changeActiveVirtual = (virtualId: string, status: number) => {
    return httpService.put(`/virtual-number/${virtualId}`, {
      body: {
        status,
      },
    });
  };
}
