import Thunderstore from "./thunderstore/index.js";

import * as fs from "fs";

(async function() {
    let community = await Thunderstore.getCommunity("lethal-company");
    let packages = await community.retrievePackages();

    let currentPackage = packages[5000];

    let latestVersion = await currentPackage.retrieveLatestVersion();

    let latestChangelog = await latestVersion.fetchChangelog();
    let latestReadMe = await latestVersion.fetchReadMe();

    fs.writeFileSync("./latestChangelog.md", latestChangelog || "", {encoding: "utf-8"});
    fs.writeFileSync("./latestReadMe.md", latestReadMe || "", {encoding: "utf-8"});

    console.log(latestVersion.fullName);
    console.log(currentPackage.totalDownloads);
    console.log(latestVersion.downloadUrl);

    let profile = Thunderstore.getProfileFromCode("0195daaa-f9ad-d7da-ead3-98e262cc6083");
    console.log(profile.profileName);
})();