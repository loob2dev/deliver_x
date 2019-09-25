export function getDeviceType(type) {
  let rtn = 2;

  switch (type) {
    case 'ios':
      rtn = 3;
      break;

    case 'android':
      rtn = 2;
      break;
  }

  return rtn;
}
