// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext, getItems, replaceItems } = require('feathers-hooks-common');
const deepRenameKeys = require('@tt-deep-rename-keys/tt-deep-rename-keys');
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
async function renameId(context) {

        // Throw if the hook is being called from an unexpected location.
        checkContext(context, null, ['find', 'get', 'create', 'update', 'patch', 'remove']);

        // Get the record(s) from context.data (before), context.result.data or context.result (after).
        // getItems always returns an array to simplify your processing.
        let records = getItems(context);

        if (!records) {
            return context;
        }

        // noinspection JSAnnotator
        if (Array.isArray(records)) {
            records = _.map(records, function(e) {
                return deeprenameId(e);
            });
        } else {
            records = deeprenameId(records);
        }
        // Place the modified records back in the context.
        replaceItems(context, records);
        // Best practice: hooks should always return the context.
        return context;
   
};


function deeprenameId(e) {
    const obj = deepRenameKeys(e, function(k) {
        const { _id, id } = e;
        if (_id && id && k === 'id') return '_id';
        if (k === '_id') return 'id';
    });
    return obj;
}


module.exports = {
    renameId
  };
  
