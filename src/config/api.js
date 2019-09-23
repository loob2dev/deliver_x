/**
 * @providesModule APIs
 */

const api = {
	ipStack: "http://api.ipstack.com/",
	get_all_countries: "https://del-xtestapi.azurewebsites.net/api/CodeList/GetAllCountries",
	get_all_parcel_types: "https://del-xtestapi.azurewebsites.net/api/CodeList/GetAllParcelTypes",
	get_all_currencies: "https://del-xtestapi.azurewebsites.net/api/CodeList/GetAllCurrencies",
    authenticate: "https://del-xtestapi.azurewebsites.net/Users/authenticate",
    get_all_transport_requests: "https://del-xtestapi.azurewebsites.net/api/Request/GetAllTransportRequests",
    update_last_Location: "https://del-xtestapi.azurewebsites.net/api/Transporter/UpdateLastLocation/",
    get_all_address_book_items: "https://del-xtestapi.azurewebsites.net/api/Request/GetAllAddressBookItems",
    create_address_book_items: "https://del-xtestapi.azurewebsites.net/api/Request/CreateAddressBookItems",
    register_new_request: "https://del-xtestapi.azurewebsites.net/api/Request/RegisterNewRequest"
}

export default api;