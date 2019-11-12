export function getDeliveryStatus(status) {
  let rtn = status;

  switch (+status) {
    case 1:
      rtn = 'Waiting for Pickup';
      break;

    case 2:
      rtn = 'Transporting';
      break;

    case 3:
      rtn = 'Waiting for Handover';
      break;

    case 4:
      rtn = 'Delivered';
      break;

    default:
      break;
  }

  return rtn;
}

export function getDeliveryInfo(item) {
  const rtn = { ...item };

  rtn.address = item.street + ' ' + item.houseNr + ', ' + item.city;
  rtn.status = getDeliveryStatus(item.deliveryStatus);
  rtn.number = item.deliveryOrder + 1;
  rtn.receiver = item;
  return rtn;
}
