const path = require('path');

/**
 *
 */
class FVTTData
{
   /**
    * @param {string[]} allDirs -
    * @param {string[]} allFiles -
    * @param {string}   baseDir -
    */
   constructor(allDirs, allFiles, baseDir)
   {
      this.allDirs = allDirs;
      this.allFiles = allFiles;
      this.baseDir = baseDir;
      this.baseDirPath = path.resolve(baseDir);
      this.copyMap = new Map();
      this.dirs =  [];
      this.files = [];

      this.jsonData = null;
      this.jsonFilename = null;
      this.jsonPath = null;

      this.newJsonFilepath = null;

      this.newJsonData = {};
      this.npmFiles = [];
      this.nodeInstallPath = `${baseDir}${path.sep}node_modules`;

      this.packageType = null;
      this.rootPath = null;
      this.npmFilePath = null;

      // jsonData,
      // jsonFilename,
      // jsonPath,
      // newJsonFilepath: `${deployDir}${path.sep}${jsonFilename}`,
      // packageType,
      // rootPath,
      // npmFilePath,
   }
}

module.exports = FVTTData;