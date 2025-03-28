import ThunderstoreAPI from "./../ThunderstoreAPI.js";
    
import { ThunderstorePackage, ThunderstorePackageVersion } from "./index.js";

export default class ThunderstoreCommunity {
    #communityData;

    constructor(communityData) {
        this.#communityData = communityData;
    }

    /**
     * Fetches a list of all thunderstore packages within a community.
     * @returns {Promise<ThunderstorePackage[]>} A promise that resolves to an array of ThunderstorePackage objects.
     */
    retrievePackages() {
        return new Promise((resolve, reject) => {
            ThunderstoreAPI.retrieveCommunityPackagesData(this.identifier)
                .then(packagesData => resolve(packagesData.map(packageData => new ThunderstorePackage(packageData))))
                .catch(err => reject(err));
        })
    }

    toString() {
        return `${this.name} (${this.identifier})`;
    }

    get communityData() { return this.#communityData; }

    get identifier() { return this.#communityData["identifier"]; }
    get name() { return this.#communityData["name"]; }
    get discordUrl() { return this.#communityData["discord_url"]; }
    get wikiUrl() { return this.#communityData["wiki_url"]; }
    get requirePackageListingApproval() { return this.#communityData["require_package_listing_approval"]; }
}