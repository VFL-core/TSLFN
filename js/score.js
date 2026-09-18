/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @param {Object|String} [levelOrUser] Optional level JSON object OR player username
 * @param {String} [userName] Optional player username if 4th arg is level object
 * @returns {Number}
 */
export function score(rank, percent, minPercent, levelOrUser, userName) {
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }

    // New formula
    let score = (-24.9975 * Math.pow(rank - 1, 0.4) + 200) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    score = Math.max(0, score);

    // Auto-detect verifier: checks if player name matches level verifier name
    let isVerifier = false;
    if (typeof levelOrUser === 'object' && levelOrUser?.verifier && userName) {
        isVerifier = levelOrUser.verifier.trim().toLowerCase() === userName.trim().toLowerCase();
    } else if (typeof levelOrUser === 'string' && typeof userName === 'string') {
        isVerifier = levelOrUser.trim().toLowerCase() === userName.trim().toLowerCase();
    } else if (typeof levelOrUser === 'boolean') {
        isVerifier = levelOrUser;
    }

    // Add 10 points for verifiers
    if (isVerifier) {
        score += 10;
    }

    if (percent != 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
}

export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}

