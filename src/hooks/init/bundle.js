import BundleUtil from '../../lib/BundleUtil.js';

/**
 * Note: This is defined as an explicit init function so that it executes before all plugin init functions.
 * As things go an init method of the command itself will run after all plugin init methods which is not desirable.
 * We want to explicitly set all bundle command flags before plugins initialize.
 *
 * @param {object} options - Oclif CLI options.
 *
 * @returns {Promise<void>}
 */
export default async function(options)
{
   globalThis.$$eventbus.trigger('log:debug', `explicit bundle command init hook running '${options.id}'.`);

   BundleUtil.addFlags({ pluginName: 'fvttdev', disableKeys: ['entry'] });
}
