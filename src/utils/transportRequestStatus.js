const Unset = 0;
const Sent = 10; // odeslán
const Accepted = 20; // Platba založena
const Paid = 30; // Platba uhrazena, notifikace dopravcum zaslána, čeká se na přijetí
const TransporterAssigned = 40; // přepravce přijal poždavek, caka se na predani
const HandoverToTransporterDone = 50; //balikzy jsou u prepravce
const PartiallyDelivered = 60; //alespon jeden balik dorucen
const Delivered = 70; //vse doruceno

export default {
  Unset,
  Sent,
  Accepted,
  Paid,
  TransporterAssigned,
  HandoverToTransporterDone,
  PartiallyDelivered,
  Delivered
};
