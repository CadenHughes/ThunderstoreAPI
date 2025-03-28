import os from 'os';
import path from 'path'
import AdmZip from "adm-zip";
import * as fs from "fs";
import * as yaml from "yaml";

import ThunderstoreAPI from "./../ThunderstoreAPI.js";

import { ThunderstorePackage, ThunderstorePackageVersion, ThunderstoreProfilePackage } from "./index.js";

export default class ThunderstoreProfile {
    static #PROFILE_DATA_PREFIX = "#r2modman";

    static #readR2Z(filePath) {
        let zip = new AdmZip(filePath);
        let r2sData = zip.readFile("export.r2x");

        let profileData = yaml.parse(r2sData.toString());

        return profileData
    }

    static #createThunderstoreProfile(profileData) {
        let profilePackages = [];

        for (let modData of profileData["mods"]) {
            let { name, version, enabled } = modData;
            version = `${version["major"]}.${version["minor"]}.${version["patch"]}`;
            enabled = enabled || false;

            let fullName = `${name}-${version}`;

            let existingPackageVersion = ThunderstorePackageVersion.checkCache(fullName)
            if (!existingPackageVersion) console.error("TODO: implement creation of packages if not stored in cache.");

            profilePackages.push(new ThunderstoreProfilePackage(existingPackageVersion, enabled));
        }

        return new ThunderstoreProfile(profileData["profileName"], profilePackages)
    }

    static async fromCode(code) {
        let data = await ThunderstoreAPI.retrieveProfileData(code);
        let b64 = data.substring(this.#PROFILE_DATA_PREFIX.length).trim();

        let decoded = Buffer.from(b64, "base64");
        let filePath = path.join(os.tmpdir(), "import.r2z");

        fs.writeFileSync(filePath, decoded);
        let profileData = ThunderstoreProfile.#readR2Z(filePath);
        fs.rmSync(filePath); // cleanup

        return ThunderstoreProfile.#createThunderstoreProfile(profileData);
    }

    #profilePackages = [];
    #profileName;

    constructor(profileName, profilePackages) {
        this.#profileName = profileName;
        this.#profilePackages = profilePackages;
    }

    async downloadPackages(location) {
        for (let profilePackage of this.profilePackages) {
            console.log(profilePackage.toString());

            await profilePackage.packageVersion.downloadTo(location);
        }
    }

    get profilePackages() { return this.#profilePackages }
    get profileName() { return this.#profileName }
}