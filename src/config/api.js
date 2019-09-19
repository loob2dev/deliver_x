/**
 * @providesModule APIs
 */

const api = {
	ipStack: "http://api.ipstack.com/",
    authenticate: "https://del-xtestapi.azurewebsites.net/Users/authenticate",
    get_all_countries: "https://del-xtestapi.azurewebsites.net/api/Request/GetAllTransportRequests",
    get_all_parcel_types: "/api/CodeList/GetAllParcelTypes",
    get_all_currencies: "/api/CodeList/GetAllCurrencies",
    notify_about_payment: "/api/PaymentNotification/NotifyAboutPayment/",
    register_new_request: "/api/Request/RegisterNewRequest",
    get_all_transportReqests: "/api/Request/GetAllTransportRequests",
    accept_transport_request_by_client: "/api/Request/AcceptTransportRequestByClient",
    get_request: "/api/Request/GetRequest/",
    get_all_address_book_items: "/api/Request/GetAllAddressBookItems"
}

export default api;