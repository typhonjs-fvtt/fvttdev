import fs                from 'fs';
import path              from 'path';
import os                from 'os';

import Events            from 'backbone-esnext-events';
import PluginManager     from 'typhonjs-plugin-manager';

import FileUtil          from '@typhonjs-node-bundle/plugin-fileutil';

import RollupRunner      from '../../lib/RollupRunner.js';

import FVTTRepo          from '../../lib/data/FVTTRepo.js';

import FlagHandler       from '../../lib/FlagHandler.js';

// TODO CHANGE TO 'info' LOG LEVEL FOR DEFAULT
const s_DEFAULT_LOG_LEVEL = 'debug';

/**
 * Creates a plugin manager instance.
 * Attaches the backbone-esnext eventbus to `process`.
 *
 * @param {object} opts - options of the CLI action.
 *
 * @returns {Promise<void>}
 */
export default async function(opts)
{
   try
   {
      // Save base executing path immediately before anything else occurs w/ CLI / Oclif.
      global.$$bundler_baseCWD = global.$$bundler_origCWD = process.cwd();

      // A short version of CWD which has the relative path if CWD is the base or subdirectory otherwise absolute.
      global.$$bundler_logCWD = '.';

      // Defines the CLI prefix to add before environment variable flag identifiers.
      global.$$flag_env_prefix = 'FVTTDEV';

      // Save the global eventbus.
      global.$$eventbus = new Events();

      s_SET_VERSION();

      // Save the global plugin manager
      global.$$pluginManager = new PluginManager({ eventbus: global.$$eventbus });

      // Adds color logger plugin
      global.$$pluginManager.add(
         {
            name: 'typhonjs-color-logger',
            options: {
               // Adds an exclusive filter which removes `FlagHandler` from stack trace / being a source of an error.
               filterConfigs: [
                  { type: 'exclusive', name: 'FlagHandler', filterString:
                        '@typhonjs-node-bundle/oclif-commons/src/util/FlagHandler.js' },
                  { type: 'exclusive', name: '@babel', filterString: '@babel' }
               ],
               showInfo: false
            }
         });

      // Set the initial starting log level.
      global.$$eventbus.trigger('log:level:set', s_DEFAULT_LOG_LEVEL);

      // TODO: Eventually move these plugins to their actual module locations.

      global.$$pluginManager.add({ name: '@typhonjs-node-bundle/plugin-fileutil', instance: FileUtil });

// TODO swap back to using flaghandler module after updating plugin manager for ESM
//      global.$$pluginManager.add({ name: '@typhonjs-node-bundle/plugin-flaghandler' });
      global.$$pluginManager.add({ name: '@typhonjs-node-bundle/plugin-flaghandler', instance: new FlagHandler() });


      global.$$pluginManager.add({ name: '@typhonjs-fvtt/fvttrepo', instance: FVTTRepo });

      // Add '@typhonjs-node-rollup/rollup-runner'
      global.$$pluginManager.add({ name: '@typhonjs-node-bundle/rollup-runner', instance: new RollupRunner() });

      global.$$eventbus.trigger('log:debug', `fvttdev init hook running '${opts.id}'.`);
   }
   catch (error)
   {
      this.error(error);
   }
}

/**
 * Sets the global name and version number for `fvttdev` in `global.$$cli_name` & `global.$$cli_version`. Also
 * provides a convenience name + package version string in `global.$$cli_name_version`.
 */
function s_SET_VERSION()
{
   global.$$cli_name = 'fvttdev';

   const homeDir = os.homedir();

   // Set the log path to be <USER_HOME>/.fvttdev/logs
   global.$$cli_log_dir = `${homeDir}${path.sep}.${global.$$cli_name}${path.sep}logs`;

   // Retrieve the local package path to pull the version number for `fvttdev`
   const packagePath = FileUtil.getURLDirpath(import.meta.url, '../../../package.json');

   try
   {
      // require(packagePath);
      const packageObj = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

      if (packageObj)
      {
         global.$$cli_version = packageObj.version;
         global.$$cli_name_version = `fvttdev (${packageObj.version})`;
      }
   }
   catch (err) { /* nop */ }
}
