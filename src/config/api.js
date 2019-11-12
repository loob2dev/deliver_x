/**
 * @providesModule APIs
 */

const root_api = 'https://del-xtestapi.azurewebsites.net/';
const api = {
  ipStack: 'http://api.ipstack.com/',
  get_all_countries: root_api + 'api/CodeList/GetAllCountries',
  get_all_parcels: root_api + 'api/CodeList/GetAllParcelTypes',
  get_all_currencies: root_api + 'api/CodeList/GetAllCurrencies',
  authenticate: root_api + 'Users/authenticate',
  get_all_transport_requests: root_api + 'api/Request/GetAllTransportRequests',
  get_all_own_undelivered_transport_requests: root_api + 'api/Transporter/GetAllOwnUndeliveredTransportRequests',
  update_last_Location: root_api + 'api/Transporter/UpdateLastLocation/',
  get_all_address_book_items: root_api + 'api/Request/GetAllAddressBookItems',
  create_address_book_items: root_api + 'api/Request/CreateAddressBookItems',
  register_new_request: root_api + 'api/Request/RegisterNewRequest',
  delete_address_book_item: root_api + 'api/Request/DeleteAddressBookItems',
  accept_transport_request_by_client: root_api + 'api/Request/AcceptTransportRequestByClient?RequestID=',
  get_parcel_image: root_api + 'api/Request/GetParcelImage/',
  get_request: root_api + 'api/Request/GetRequest/',

  get_all_unaccepted_by_transporter: root_api + 'api/Transporter/GetAllUnacceptedByTransporter',
  reject_request: root_api + 'api/Transporter/RequestRejected/',
  accept_request: root_api + 'api/Transporter/AcceptTransportRequest/',

  load_pachages: root_api + 'api/Transporter/PackagesLoaded/',
  deliveried_pachage: root_api + 'api/Transporter/PackageDelivered/',
};

export default api;
