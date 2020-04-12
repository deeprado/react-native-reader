/*
 * description: the weight of toast
 */

import Toast from 'react-native-root-toast';

let toast = null;

export const toastShort = (message) => {
  toast && toast.destroy();
  toast = Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    shadow: false,
    animation: true,
    hideOnPress: false,
    delay: 0,
    onHidden: () => {
      toast.destroy();
      toast = null;
    },
  });
};

export const toastLong = (message) => {
  toast && toast.destroy();
  toast = Toast.show(message, {
    duration: Toast.durations.Long,
    position: Toast.positions.CENTER,
    shadow: false,
    animation: true,
    hideOnPress: false,
    delay: 0,
    onHidden: () => {
      toast.destroy();
      toast = null;
    },
  });
};

export default {
  toastShort,
  toastLong,
};
