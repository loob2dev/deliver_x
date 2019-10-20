/**
 * @providesModule APIs
 */

const api = {
  ipStack: 'http://api.ipstack.com/',
  get_all_countries: 'https://del-xtestapi.azurewebsites.net/api/CodeList/GetAllCountries',
  get_all_parcels: 'https://del-xtestapi.azurewebsites.net/api/CodeList/GetAllParcelTypes',
  get_all_currencies: 'https://del-xtestapi.azurewebsites.net/api/CodeList/GetAllCurrencies',
  authenticate: 'https://del-xtestapi.azurewebsites.net/Users/authenticate',
  get_all_transport_requests: 'https://del-xtestapi.azurewebsites.net/api/Request/GetAllTransportRequests',
  get_all_own_undelivered_transport_requests: 'https://del-xtestapi.azurewebsites.net/api/Transporter/GetAllOwnUndeliveredTransportRequests',
  update_last_Location: 'https://del-xtestapi.azurewebsites.net/api/Transporter/UpdateLastLocation/',
  get_all_address_book_items: 'https://del-xtestapi.azurewebsites.net/api/Request/GetAllAddressBookItems',
  create_address_book_items: 'https://del-xtestapi.azurewebsites.net/api/Request/CreateAddressBookItems',
  register_new_request: 'https://del-xtestapi.azurewebsites.net/api/Request/RegisterNewRequest',
  delete_address_book_item: 'https://del-xtestapi.azurewebsites.net/api/Request/DeleteAddressBookItems',
};

export default api;
