/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectItem } from 'shared/form/select/select-controller.component';

export const convertStringToSelectItem = (
  stringHotline?: string
): SelectItem[] => {
  if (!stringHotline) return [];

  return stringHotline
    .split(/[,;]/)
    .map((item) => ({ label: item, value: item }));
};

export const convertArrayToSelectItem = <T>(
  array: any[],
  label: keyof T,
  value: keyof T
): SelectItem[] => {
  if (!array || !array?.length) return [];

  return array.map((item) => ({ label: item[label], value: item[value] }));
};

export const convertStringToArray = (stringHotline?: string): string[] => {
  if (!stringHotline) return [];

  return stringHotline.split(/[,;]/);
};

export const getDifferenceTwoArray = (
  array1: any[],
  array2: any[]
): string[] => {
  return array1.filter((item) => !array2.includes(item));
};
