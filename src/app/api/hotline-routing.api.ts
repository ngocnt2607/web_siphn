/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';
import { HotlineGroups } from './customer.api';

export interface HotlineRoutingList {
  hotlineGroups: HotlineRouting[];
}

export interface HotlineRouting extends HotlineGroups {
  trunkId: number;
  trunkName: string;
  ip: string;
  port: string;
}

interface SetTrunkParams {
  trunkId: string | number;
  customerId: number | string;
  hotlineGroupId: string | number;
}

export default class HotlineRoutingAPI {
  static getListHotlineRouting = async () => {
    return await httpService.get<HotlineRoutingList>('/hotline');
  };

  static setTrunkToGroupHotline = async (params: SetTrunkParams) => {
    const { customerId, hotlineGroupId, trunkId } = params;
    return await httpService.post(
      `/customer/${customerId}/hotline-group/${hotlineGroupId}/trunk`,
      {
        body: { trunkId },
      }
    );
  };
}
