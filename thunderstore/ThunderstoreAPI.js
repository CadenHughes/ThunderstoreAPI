import { pipeline } from 'stream/promises';
import os from 'os';
import path from 'path'
import * as fs from "fs";
import AdmZip from "adm-zip";

export default class ThunderstoreAPI {
    static domain = "thunderstore.io";

    static async unzip(file, location) {
        let zip = new AdmZip(file);
        zip.extractAllTo(location, true)
    }

    static async download(url, location) {
        const stream = fs.createWriteStream(location);
        const { body } = await fetch(url);

        await pipeline(body, stream);
    }

    static async downloadAndUnzip(url, location) {
        let folderName = path.basename(path.dirname(location))
        let zipLocation = path.join(os.tmpdir(), `${folderName}.zip`);

        await ThunderstoreAPI.download(url, zipLocation)
        await ThunderstoreAPI.unzip(zipLocation, location)
    }

    static requestText(url) {
        console.log("\t- " + url)

        return new Promise((resolve, reject) => fetch(url)
            .then(res => res.text())
            .then(data => resolve(data))
            .catch(() => reject("Request failed.")));
    }

    static request(url) {
        console.log("\t- " + url)

        return new Promise((resolve, reject) => fetch(url)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(() => reject("Request failed.")));
    }

    static requestThunderStore = (path) => this.request(`https://${this.domain}${path}`);
    
    static async retrieveAllPaginatedResults(startingPath) {
        try {
            let response = await this.requestThunderStore(startingPath);
            let results = [];
    
            while (response["pagination"]?.next_link) {
                results.push(...response["results"]);
                response = await this.request(response["pagination"]["next_link"]);
            }
    
            results.push(...response["results"]);
            return results;
        } catch (err) {
            throw new Error("Request failed.");
        }
    }

    static fetchMarkdown(path) {
        return new Promise((resolve, reject) => {
            ThunderstoreAPI.requestThunderStore(path)
                .then((response) => resolve(response["markdown"]))
                .catch(() => reject("Request failed."));
        })
    }

    static retrievePackagesData = () => this.requestThunderStore("/api/v1/package");
    static retrieveCommunityPackagesData = (communityIdentifier) => this.requestThunderStore(`/c/${communityIdentifier}/api/v1/package`);

    static retrieveCommunitiesData = () => this.retrieveAllPaginatedResults("/api/experimental/community");
    static retrievePackageData = (namespace, name) => this.requestThunderStore(`/api/experimental/package/${namespace}/${name}`);

    static retrieveProfileData = (code) => this.requestText(`https://gcdn.thunderstore.io/live/modpacks/legacyprofile/${code}`);
}