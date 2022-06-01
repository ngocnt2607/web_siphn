/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';

export interface TrunkList {
  groupIps: TrunkInfo[];
}

export interface TrunkInfo {
  id: string;
  ip: string;
  port: string;
  groupCode: string;
  groupName: string;
  trunkName: string;
  status: number;
}

export interface TelecomList {
  groups: TelecomInfo[];
}

export interface TelecomInfo {
  id: string;
  groupName: string;
  groupCode: string;
}

export interface CreateTrunkParams {
  groupName?: string;
  trunkName: string;
  ip: string;
  port: string;
}

export interface UpdateTrunkParams {
  groupCode: string;
  trunkId: string;
  status: number;
  trunkName?: string;
  ip?: string;
  port?: string;
}

export default class TrunkAPI {
  static getListTrunk = async () => {
    return httpService.get<TrunkList>('/group/*/ip');
  };

  static getDetailTrunk = async (groupCode: string) => {
    return httpService.get<TrunkList>(`/group/${groupCode}/ip`);
  };

  static getTelecom = async () => {
    return httpService.get<TelecomList>('/group');
  };

  static createNewTrunk = async (data: CreateTrunkParams) => {
    const { groupName, ...rest } = data;

    return httpService.post<TrunkInfo>(`/group/${groupName}/ip`, {
      body: { ...rest },
    });
  };

  static updateTrunk = async (data: UpdateTrunkParams) => {
    const { trunkId, groupCode, ...rest } = data;
    return httpService.put(`/group/${groupCode}/ip/${trunkId}`, {
      body: { ...rest },
    });
  };
}
