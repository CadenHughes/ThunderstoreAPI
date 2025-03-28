import ThunderstoreAPI from "./../ThunderstoreAPI.js";

import { ThunderstoreCommunity, ThunderstorePackageVersion } from "./index.js";

export default class ThunderstorePackage {
    #packageData;
    #additionalPackageData;
    #versions = [];

    #totalDownloads = 0;

    constructor(packageData) {
        this.#packageData = packageData;

        for (let versionData of this.#packageData["versions"]) {
            this.#versions.push(new ThunderstorePackageVersion(this, versionData));
        }

        for (let version of this.versions) {
            this.#totalDownloads += version.downloads;
        }
    }

    /**
     * Fetches missing data about the package
     * @returns {Promise<Object>} A promise that resolves to an Object  .
     */
    fetchAdditionalData() {
        if (this.#additionalPackageData) return Promise.resolve();

        return new Promise((resolve, reject) => {
            ThunderstoreAPI.retrievePackageData(this.namespace, this.name)
                .then((additionalPackageData) => {
                    this.#additionalPackageData = additionalPackageData;
                    
                    resolve(additionalPackageData);
                })
                .catch(() => reject("Unable to fetch additional package data"));
        })
    }

    /**
     * Retrieves the latest version of the package.
     * @async
     * @returns {ThunderstorePackageVersion} A promise that resolves to a ThunderstorePackageVersion object.
     */
    async retrieveLatestVersion() {
        try {
            await this.fetchAdditionalData();
    
            let latestVersion = this.versions.find(version => version.versionNumber === this.#additionalPackageData["latest"]["version_number"])
            if (!latestVersion) throw new Error("Latest version and package versions mismatch.");

            return latestVersion;
        } catch (err) {
            throw new Error(`Error retrieving latest version: ${err}`);
        }
    }

    toString() {
        return this.fullName;
    }

    get packageData() { return this.#packageData; }
    get versions() { return this.#versions; }
    
    get totalDownloads() { return this.#totalDownloads }

    get name() { return this.#packageData["name"]; }
    get fullName() { return this.#packageData["full_name"]; }
    get owner() { return this.#packageData["owner"]; }
    get packageUrl() { return this.#packageData["package_url"]; }
    get donationLink() { return this.#packageData["donation_link"]; }
    get dateCreated() { return new Date(this.#packageData["date_created"]); }
    get dateUpdated() { return new Date(this.#packageData["date_updated"]); }
    get uuid4() { return this.#packageData["uuid4"]; }
    get ratingScore() { return this.#packageData["rating_score"]; }
    get isPinned() { return this.#packageData["is_pinned"]; }
    get isDeprecated() { return this.#packageData["is_deprecated"]; }
    get hasNsfwContent() { return this.#packageData["has_nsfw_content"]; }
    get categories() { return this.#packageData["categories"]; }
    
    get namespace() { return this.#packageData["owner"]; } // the same as owner
}