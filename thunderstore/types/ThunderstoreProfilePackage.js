export default class ThunderstoreProfilePackage {
    #enabled; #packageVersion;

    constructor(packageVersion, enabled) {
        this.#packageVersion = packageVersion;
        this.#enabled = enabled;
    }

    toString() {
        return `${this.packageVersion.toString()}, enabled=${this.enabled}`;
    }

    get enabled() { return this.#enabled }
    get packageVersion() { return this.#packageVersion }
}