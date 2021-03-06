/**
 *
 */
export default class BundleData
{
   /**
    * @param {object}   cliFlags - The CLI flags.
    */
   constructor(cliFlags)
   {
      this.cliFlags = cliFlags;
      this.entries = [];
      this.deployDir = typeof cliFlags.deploy === 'string' ? cliFlags.deploy : './dist';
      this.reverseRelativePath = null;

      // reverseRelativePath: path.relative(deployDir, rootPath)
   }
}
