const categories = ['Techniques', 'Tools', 'Platforms', 'Languages & Framework'];
const ring = ['Adopt', 'Trial', 'Assess', 'Hold'];

module.exports = {
    validateTechnologyInsertInput: function(technologyInput) {
        if (!technologyInput.name || !technologyInput.category || !technologyInput.description) {
            return false;
        }

        if (!isStringAndNotEmpty(technologyInput.name)) {
            return false;
        }

        if (!categories.includes(technologyInput.category)) {
            return false;
        }

        if (technologyInput.ring !== undefined && !ring.includes(technologyInput.ring)) {
            return false;
        }

        if (!isStringAndNotEmpty(technologyInput.description)) {
            return false;
        }

        return true;
    },
    validateTechnologyUpdateInput: function(technologyInput) {
        if (!technologyInput.name || !technologyInput.category || !technologyInput.description) {
            return false;
        }

        if (!isStringAndNotEmpty(technologyInput.name)) {
            return false;
        }

        if (!categories.includes(technologyInput.category)) {
            return false;
        }

        if (!isStringAndNotEmpty(technologyInput.description)) {
            return false;
        }

        return true;
    },
    validateTechnologyUpdateRing: function(technologyInput) {
        if (!technologyInput.ring || !technologyInput.ring_description) {
            return false;
        }

        if (!ring.includes(technologyInput.ring)) {
            return false;
        }

        if (!isStringAndNotEmpty(technologyInput.ring_description)) {
            return false;
        }

        return true;
    }


};

function isStringAndNotEmpty(input) {
    return typeof input === 'string' && input !== '';
}