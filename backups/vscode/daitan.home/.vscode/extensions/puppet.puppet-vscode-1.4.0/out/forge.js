"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuppetModuleCompletion = exports.getModuleInfo = exports.getPDKVersion = exports.buildMarkdown = void 0;
const axios_1 = require("axios");
const vscode_1 = require("vscode");
function getVersion() {
    const pkg = vscode_1.extensions.getExtension('puppet.puppet-vscode');
    return pkg.packageJSON.version;
}
function buildMarkdown(info) {
    var _a;
    const message = `## ${info.name}\n
${info.summary}\n
**Latest version:** ${info.version} (${info.updated.toDateString()})\n
**Forge**: [${info.forgeUrl}](${info.forgeUrl})\n
**Project**: [${info.homepageUrl}](${info.homepageUrl})\n
**Owner:** ${info.owner.username}\n
**Endorsement:** ${(_a = info.endorsement) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()}\n
**Score:** ${info.score}\n
`;
    return new vscode_1.MarkdownString(message);
}
exports.buildMarkdown = buildMarkdown;
function getPDKVersion(logger) {
    return new Promise((resolve) => {
        return axios_1.default
            .get('https://s3.amazonaws.com/puppet-pdk/pdk/LATEST', {
            params: {
                // eslint-disable-next-line @typescript-eslint/camelcase
                exclude_fields: 'readme changelog license reference',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': `puppet-vscode/${getVersion()}`,
            },
        })
            .then((response) => {
            if (response.status !== 200) {
                logger.error(`Error getting Puppet forge data. Status: ${response.status}:${response.statusText}`);
                resolve();
            }
            return response.data;
        });
    });
}
exports.getPDKVersion = getPDKVersion;
function getModuleInfo(title, logger) {
    return new Promise((resolve) => {
        return axios_1.default
            .get(`https://forgeapi.puppet.com/v3/modules/${title}`, {
            params: {
                // eslint-disable-next-line @typescript-eslint/camelcase
                exclude_fields: 'readme changelog license reference',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': `puppet-vscode/${getVersion()}`,
            },
        })
            .then((response) => {
            var _a, _b;
            if (response.status !== 200) {
                logger.error(`Error getting Puppet forge data. Status: ${response.status}:${response.statusText}`);
                resolve();
            }
            const info = response.data;
            const module = {
                uri: info.uri,
                slug: info.slug,
                name: info.name,
                downloads: info.downloads,
                score: info.feedback_score,
                created: new Date(info.created_at),
                updated: new Date(info.updated_at),
                endorsement: (_a = info.endorsement) !== null && _a !== void 0 ? _a : '',
                forgeUrl: `https://forge.puppet.com/${info.owner.username}/${info.name}`,
                homepageUrl: (_b = info.homepage_url) !== null && _b !== void 0 ? _b : '',
                version: info.current_release.version,
                owner: {
                    uri: info.owner.uri,
                    slug: info.owner.slug,
                    username: info.owner.username,
                    gravatar: info.owner.gravatar_id,
                },
                summary: info.current_release.metadata.summary,
            };
            resolve(module);
        })
            .catch((error) => {
            logger.error(`Error getting Puppet forge data: ${error}`);
            resolve();
        });
    });
}
exports.getModuleInfo = getModuleInfo;
function getPuppetModuleCompletion(text, logger) {
    return new Promise((resolve) => {
        return axios_1.default
            .get(`https://forgeapi.puppet.com/private/modules?starts_with=${text}`, {
            params: {
                // eslint-disable-next-line @typescript-eslint/camelcase
                exclude_fields: 'readme changelog license reference',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': `puppet-vscode/${getVersion()}`,
            },
        })
            .then((response) => {
            if (response.status !== 200) {
                logger.error(`Error getting Puppet forge data. Status: ${response.status}:${response.statusText}`);
                resolve();
            }
            const info = response.data;
            const results = info.results;
            const data = {
                total: parseInt(info.total),
                modules: results,
            };
            resolve(data);
        })
            .catch((error) => {
            logger.error(`Error getting Puppet forge data: ${error}`);
            resolve();
        });
    });
}
exports.getPuppetModuleCompletion = getPuppetModuleCompletion;
//# sourceMappingURL=forge.js.map