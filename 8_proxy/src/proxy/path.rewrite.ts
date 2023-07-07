type RewriteRule = { regex: RegExp; value: string };

export type PlainObject = { [name: string]: any }
export type PlainObjectOf<T> = { [name: string]: T }

export function isPlainObj(obj: any): obj is PlainObject {
    return obj && obj.constructor === Object || false;
}

/**
 * Create rewrite function, to cache parsed rewrite rules.
 *
 * @param {Object} rewriteConfig
 * @return {Function} Function to rewrite paths; This function should accept `path` (request.url) as parameter
 */
export function createPathRewriter(rewriteConfig) {
    let rulesCache: RewriteRule[];

    if (!isValidRewriteConfig(rewriteConfig)) {
        return;
    }

    if (typeof rewriteConfig === 'function') {
        const customRewriteFn = rewriteConfig;
        return customRewriteFn;
    } else {
        rulesCache = parsePathRewriteRules(rewriteConfig);
        return rewritePath;
    }

    function rewritePath(path) {
        let result = path;

        for (const rule of rulesCache) {
            if (rule.regex.test(path)) {
                result = result.replace(rule.regex, rule.value);
                console.debug('rewriting path from "%s" to "%s"', path, result);
                break;
            }
        }

        return result;
    }
}

function isValidRewriteConfig(rewriteConfig) {
    if (typeof rewriteConfig === 'function') {
        return true;
    } else if (isPlainObj(rewriteConfig)) {
        return Object.keys(rewriteConfig).length !== 0;
    } else if (rewriteConfig === undefined || rewriteConfig === null) {
        return false;
    } else {
        throw new Error('ERR_PATH_REWRITER_CONFIG');
    }
}

function parsePathRewriteRules(rewriteConfig: Record<string, string>) {
    const rules: RewriteRule[] = [];

    if (isPlainObj(rewriteConfig)) {
        for (const [key, value] of Object.entries(rewriteConfig)) {
            rules.push({
                regex: new RegExp(key),
                value: value,
            });
            console.debug('rewrite rule created: "%s" ~> "%s"', key, value);
        }
    }

    return rules;
}