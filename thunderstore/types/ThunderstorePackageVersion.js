import path from "path";

import ThunderstoreAPI from "./../ThunderstoreAPI.js";

import { ThunderstoreCommunity, ThunderstorePackage } from "./index.js";

export default class ThunderstorePackageVersion {
    static #versionCache = [];

    #package;
    #versionData;

    static checkCache(fullName) {
        return ThunderstorePackageVersion.#versionCache.find((version) => version.fullName === fullName);
    }

    static #addToCache(version) {
        ThunderstorePackageVersion.#versionCache.push(version);
    }

    constructor(pkg, versionData) {
        this.#package = pkg;
        this.#versionData = versionData;

        ThunderstorePackageVersion.#addToCache(this);
    }

    /**
     * Fetches the markdown changelog for the version
     * @returns {Promise<String?>} A promise that resolves to a string containing markdown
     */
    fetchChangelog = () => ThunderstoreAPI.fetchMarkdown(`/api/experimental/package/${this.package.namespace}/${this.name}/${this.versionNumber}/changelog`);
    
    /**
     * Fetches the markdown readme for the version
     * @returns {Promise<String?>} A promise that resolves to a string containing markdown
     */
    fetchReadMe = () => ThunderstoreAPI.fetchMarkdown(`/api/experimental/package/${this.package.namespace}/${this.name}/${this.versionNumber}/readme`);

    /**
     * Downloads the mod and unzips it to a directory
     * @async
     */
    async downloadTo(directory) {
        await ThunderstoreAPI.downloadAndUnzip(this.downloadUrl, path.join(directory, this.fullName));
    }

    toString() {
        return this.fullName;
    }

    get package() { return this.#package; }
    get versionData() { return this.#versionData; }

    get name() { return this.#versionData["name"]; }
    get fullName() { return this.#versionData["full_name"]; }
    get description() { return this.#versionData["description"]; }
    get icon() { return this.#versionData["icon"]; }
    get versionNumber() { return this.#versionData["version_number"]; }
    get dependencies() { return this.#versionData["dependencies"] || []; }
    get downloadUrl() { return this.#versionData["download_url"]; }
    get downloads() { return this.#versionData["downloads"]; }
    get dateCreated() { return new Date(this.#versionData["date_created"]); }
    get websiteUrl() { return this.#versionData["website_url"]; }
    get isActive() { return this.#versionData["is_active"]; }
    get uuid4() { return this.#versionData["uuid4"]; }
    get fileSize() { return this.#versionData["file_size"]; }
}