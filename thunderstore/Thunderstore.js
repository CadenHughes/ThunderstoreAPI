import ThunderstoreAPI from "./ThunderstoreAPI.js";

import { ThunderstoreCommunity, ThunderstorePackage, ThunderstorePackageVersion, ThunderstoreProfile } from "./types/index.js";

export default class Thunderstore {
    static async test() {
        let profile = await ThunderstoreProfile.fromCode("0195daaa-f9ad-d7da-ead3-98e262cc6083");
        await profile.downloadPackages("C:/test/")
    }

    /**
     * Fetches a list of all thunderstore packages.
     * @returns {Promise<ThunderstorePackage[]>} A promise that resolves to an array of ThunderstorePackage objects.
     */
    static retrieveAllPackages() {
        return new Promise((resolve, reject) => {
            ThunderstoreAPI.retrievePackagesData()
                .then(packagesData => resolve(packagesData.map(packageData => new ThunderstorePackage(packageData))))
                .catch(err => reject(err));
        })
    }

    /**
     * Fetches a list of all thunderstore communities.
     * @returns {Promise<ThunderstorePackage[]>} A promise that resolves to an array of ThunderstoreCommunity objects.
     */
    static retrieveAllCommunities() {
        return new Promise((resolve, reject) => {
            ThunderstoreAPI.retrieveCommunitiesData()
                .then(communitiesData => resolve(communitiesData.map(communityData => new ThunderstoreCommunity(communityData))))
                .catch(err => reject(err));
        })
    }

    /**
     * Fetches the community identifier with a community name.
     * @async
     * @returns {String} A string containing the community identifier.
     */
    static async getCommunityIdentifer(name) {
        try {
            const communities = await this.retrieveAllCommunities();
            const community = communities.find(community => community.name.toLowerCase() === name.toLowerCase());
    
            if (community) {
                return community.identifier;
            } else {
                throw new Error(`Community with the name "${name}" not found.`);
            }
        } catch (err) {
            throw new Error(`Error retrieving community identifier: ${err.message}`);
        }
    }

    /**
     * Fetches the community with a community identifier.
     * @async
     * @returns {ThunderstoreCommunity} A ThunderstoreCommunity object.
     */
    static async getCommunity(identifier) {
        try {
            const communities = await this.retrieveAllCommunities();
            const community = communities.find(community => community.identifier === identifier);

            if (community) {
                return community;
            } else {
                throw new Error(`Community with the identifier "${name}" not found.`);
            }
        } catch (err) {
            throw new Error(`Error retrieving community: ${err.message}`);
        }
    }
}