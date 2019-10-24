import requestStatus from './transportRequestStatus';

export function getDeliveryStatus(status) {
  let rtn = status;

  switch (+status) {
    case requestStatus.Unset:
      rtn = 'Unset';
      break;

    case requestStatus.Sent:
      rtn = 'Sent';
      break;

    case requestStatus.Accepted:
      rtn = 'Accepted';
      break;

    case requestStatus.Paid:
      rtn = 'Paid';
      break;

    case requestStatus.TransporterAssigned:
      rtn = 'Transporter assigned';
      break;

    case requestStatus.HandoverToTransporterDone:
      rtn = 'Handover to Transporter done';
      break;

    case requestStatus.PartiallyDelivered:
      rtn = 'Partially delivered';
      break;

    case requestStatus.Delivered:
      rtn = 'Delivered';
      break;

    default:
      break;
  }

  return rtn;
}

export function getRequestInfo(item) {
  const rtn = { ...item };

  rtn.address = item.street + (item.houseNr ? ' ' + item.houseNr : '') + ', ' + item.city;
  rtn.status = getDeliveryStatus(item.deliveryStatus);
  rtn.number = item.deliveryOrder + 1;
  rtn.receiver = item;
  return rtn;
}
