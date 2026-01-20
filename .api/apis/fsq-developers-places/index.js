"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'fsq-developers-places/20250617 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Returns a list of top places, geos, and/or searches partially matching the provided
     * keyword and location inputs.
     *
     * @summary Autocomplete
     */
    SDK.prototype.autocomplete = function (metadata) {
        return this.core.fetch('/autocomplete', 'get', metadata);
    };
    /**
     * Search for places in the FSQ Places database using a location and querying by name,
     * category name, telephone number, taste label, or chain name. For example, search for
     * "coffee" to get back a list of recommended coffee shops.
     *
     * You may pass a location with your request by using one of the following options. If none
     * of the following options are passed, Place Search defaults to geolocation using ip
     * biasing with the optional radius parameter.
     *
     * <ul><li>ll & radius (circular boundary)</li><li>near (geocodable locality)</li><li>ne &
     * sw (rectangular boundary)</li></ul>
     *
     * @summary Place Search
     */
    SDK.prototype.placeSearch = function (metadata) {
        return this.core.fetch('/places/search', 'get', metadata);
    };
    /**
     * Returns a list of places that match a natural-language question. Provide `query` with
     * what the user wants (e.g., "best cocktail lounge"). Location is first attempted to be
     * parsed from the query, but you may optionally use either `ll` (lat,lng) or `location`
     * (geocodable string) as fallbacks to set the search area.  You may also pass `context` to
     * describe preferences (e.g., "traveling with kids, need outdoor seating").
     *
     * @summary Natural Language Place Search
     */
    SDK.prototype.ask = function (metadata) {
        return this.core.fetch('/places/ask', 'get', metadata);
    };
    /**
     * Retrieve comprehensive information and metadata for a FSQ Place using the fsq_place_id.
     *
     * @summary Get Place Details
     */
    SDK.prototype.placeDetails = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}', 'get', metadata);
    };
    /**
     * Retrieve tips for a FSQ Place using the fsq_place_id.
     *
     * @summary Get Place Tips
     */
    SDK.prototype.placeTips = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}/tips', 'get', metadata);
    };
    /**
     * Retrieve photos for a FSQ Place using the fsq_place_id.
     *
     * To retrieve photos from a Photos response, learn [how to assemble photo
     * URLs](https://docs.foursquare.com/reference/photos-guide#assembling-a-photo-url).
     *
     * @summary Get Place Photos
     */
    SDK.prototype.placePhotos = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}/photos', 'get', metadata);
    };
    /**
     * Suggest the merge of two or more places.
     *
     * @summary Merge Places
     */
    SDK.prototype.suggestMerge = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}/suggest/merge', 'post', metadata);
    };
    /**
     * Suggest edits to an existing Place’s information such as address, phone number, and
     * hours of operation via its `fsq_place_id`. Providing values for the parameters below
     * constitute the proposed edit.
     *
     * @summary Edit a Place
     */
    SDK.prototype.placeSuggestEdit = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}/suggest/edit', 'post', metadata);
    };
    /**
     * Flag an entire place for removal for reasons such as closed, doesn't exist,
     * inappropriate, or private.
     *
     * @summary Remove a Place
     */
    SDK.prototype.placeSuggestRemove = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}/suggest/remove', 'post', metadata);
    };
    /**
     * Flag a field(s) on a Place as incorrect. Does not require you to provide the correct
     * value.
     *
     * @summary Flag a Place
     */
    SDK.prototype.placeFlag = function (metadata) {
        return this.core.fetch('/places/{fsq_place_id}/suggest/flag', 'post', metadata);
    };
    /**
     * Add a new place that does not currently exist. We will first attempt to find a match in
     * our database. If we do not find a match, we will create a new suggested place.
     *
     * @summary Suggest a New Place
     */
    SDK.prototype.placesSuggestPlace = function (metadata) {
        return this.core.fetch('/places/suggest/place', 'post', metadata);
    };
    /**
     * Monitor the status of the places edits provided by your users or service keys.
     *
     * @summary Get Suggestion Status
     */
    SDK.prototype.placeSuggestStatus = function (metadata) {
        return this.core.fetch('/places/suggest/status', 'get', metadata);
    };
    /**
     * Get a list of the top places that need review for a given location.
     *
     * @summary Get Places With Pending Suggested Edits
     */
    SDK.prototype.placeTopVenueWoes = function (metadata) {
        return this.core.fetch('/places/suggest/review', 'get', metadata);
    };
    /**
     * Utilize Foursquare's Snap to Place technology to detect where your user's device is and
     * what is around them.
     *
     * This endpoint will intentionally return lower quality results not found in Place Search.
     * It is not intended to replace Place Search as the primary way to search for top,
     * recommended POIs.
     *
     * @summary Find Geotagging Candidates
     */
    SDK.prototype.geotaggingCandidates = function (metadata) {
        return this.core.fetch('/geotagging/candidates', 'get', metadata);
    };
    /**
     * Report the selection of a place as the result of a Geotagging Candidates request.
     *
     * @summary Confirm Geotagging Candidate Selection
     */
    SDK.prototype.geotaggingConfirm = function (metadata) {
        return this.core.fetch('/geotagging/confirm', 'post', metadata);
    };
    /**
     * Check the status of previously submitted Places API offline jobs. Jobs and their
     * statuses are retained for 90 days after initialization.
     *
     * For more details on how to use the Offline Jobs Endpoints, please refer to the
     * [onboarding
     * guide](https://docs.foursquare.com/fsq-developers-places/reference/offline-job-onboarding-guide).
     *
     * @summary Get Offline Jobs Status
     */
    SDK.prototype.offlineJobsStatus = function (metadata) {
        return this.core.fetch('/offline-jobs/status', 'get', metadata);
    };
    /**
     * Execute a previously initialized offline job. Note you may not execute jobs that are
     * already running or have completed, but you may use this endpoint to re-execute failed
     * jobs.
     *
     * For more details on how to use the Offline Jobs Endpoints, please refer to the
     * [onboarding
     * guide](https://docs.foursquare.com/fsq-developers-places/reference/offline-job-onboarding-guide).
     *
     * @summary Execute an Offline Job
     */
    SDK.prototype.offlineJobsExecute = function (metadata) {
        return this.core.fetch('/offline-jobs/{fsq_job_id}/execute', 'post', metadata);
    };
    /**
     * Initialize an offline job and generate temporary AWS credentials for uploading and
     * reading data.
     *
     * For more details on how to use the Offline Jobs Endpoints, please refer to the
     * [onboarding
     * guide](https://docs.foursquare.com/fsq-developers-places/reference/offline-job-onboarding-guide).
     *
     * @summary Initialize an Offline Job
     */
    SDK.prototype.offlineJobsInitialize = function (metadata) {
        return this.core.fetch('/offline-jobs/initialize', 'post', metadata);
    };
    /**
     * Refreshes temporary AWS credentials for an existing offline job. This is useful if your
     * original credentials have expired.
     *
     * For more details on how to use the Offline Jobs Endpoints, please refer to the
     * [onboarding
     * guide](https://docs.foursquare.com/fsq-developers-places/reference/offline-job-onboarding-guide).
     *
     * @summary Refresh Offline Job Credentials
     */
    SDK.prototype.offlineJobsCredentialsRefresh = function (metadata) {
        return this.core.fetch('/offline-jobs/{fsq_job_id}/credentials/refresh', 'post', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
