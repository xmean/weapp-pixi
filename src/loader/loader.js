import * as PIXI from 'pixi.js';
import SparkMD5 from 'spark-md5';
const DOMParser = require('xmldom').DOMParser;

export default class ResLoader {
  static RES_CACHE_HIT = 0;
  static RES_CACHE_FETCH = 1;
  static RES_CACHE_EXPIRE = 2;

  static RES_TYPE_TEXTURE = 0;
  static RES_TYPE_SPRITE_SHEET = 1;
  static RES_TYPE_BITMAP_FONT = 2;

  constructor(env, cloudPath, entryFileName) {
    wx.cloud.init({
      env: env
    });

    this.cloudPath = cloudPath;
    this.localPath = wx.env.USER_DATA_PATH;
    this.entryFileName = entryFileName;
    this.fs = wx.getFileSystemManager();

    this.resources = [];
  }

  async _syncLocalFile(filePath, md5) {
    const localFile = this.localPath + '/' + filePath;
    const cloudFile = this.cloudPath + '/' + filePath;
    let needDownload = false;
    let cacheType = ResLoader.RES_CACHE_FETCH;

    try {
      this.fs.accessSync(localFile);
    } catch (error) {
      needDownload = true;
    }

    // check file md5

    if (!needDownload) {
      if (new SparkMD5.ArrayBuffer().append(this.fs.readFileSync(localFile)).end(false) === md5) {
        needDownload = false;
        cacheType = ResLoader.RES_CACHE_HIT;
      } else {
        this.fs.unlinkSync(localFile);
        needDownload = true;
        cacheType = ResLoader.RES_CACHE_EXPIRE;
      }
    }

    // download file if needed

    if (needDownload) {
      const dirs = filePath.split('/').slice(0, -1);
      let dir = this.localPath + '/';

      for (const d of dirs) {
        dir += '/' + d;
        try {
          this.fs.accessSync(dir);
        } catch (error) {
          this.fs.mkdirSync(dir);
        }
      }

      await wx.cloud.downloadFile({
        fileID: cloudFile
      }).then((res) => {
        this.fs.saveFileSync(res.tempFilePath, localFile);
      }).catch(console.error);
    }

    return cacheType;
  }

  _sync(onComplete) {
    wx.cloud.downloadFile({
      fileID: this.cloudPath + '/' + this.entryFileName,
      success: (res) => {
        this.fs.saveFile({
          tempFilePath: res.tempFilePath,
          filePath: this.localPath + '/' + this.entryFileName,
          success: (res) => {
            this.fs.readFile({
              filePath: res.savedFilePath,
              encoding: 'utf-8',
              success: async (res) => {
                this.assetList = JSON.parse(res.data);
                let progress = 0;
                const total = this.assetList.length;

                for (const fileItem of this.assetList) {
                  const cache = await this._syncLocalFile(fileItem.filename, fileItem.md5);

                  if (typeof this.onSyncProgress === 'function') {
                    this.onSyncProgress({
                      filename: fileItem.filename,
                      md5: fileItem.md5,
                      cache: cache
                    }, ++progress / total);
                  }
                }

                if (typeof onComplete === 'function') {
                  onComplete();
                }
              },
              fail: console.error
            });
          },
          fail: console.error
        });
      },
      fail: console.error
    });
  }

  _getFilePath(file) {
    let filePath = file;

    try {
      this.fs.accessSync(filePath);
    } catch (error) {
      filePath = this.localPath + '/' + file;
    }

    try {
      this.fs.accessSync(filePath);
    } catch (error) {
      if (typeof this.onLoadError === 'function') {
        this.onLoadError(file, 'resource file does not found');
      }

      return false;
    }

    return filePath;
  }

  async _loadBaseTexture(image) {
    const imagePath = this._getFilePath(image);

    if (imagePath) {
      return new Promise((resolve) => {
        const img = wx.createImage();

        img.src = imagePath;
        img.onload = () => resolve(new PIXI.BaseTexture(img));
      });
    }

    return false;
  }

  async loadTexture(id, image) {
    const texture = await this._loadBaseTexture(image);

    if (texture) {
      PIXI.Texture.addToCache(new PIXI.Texture(texture), id);
      return true;
    }

    return false;
  }

  async loadSpritesheet(json, image) {
    const jsonPath = this._getFilePath(json);
    const texture = await this._loadBaseTexture(image);
    let data = null;

    try {
      data = JSON.parse(this.fs.readFileSync(jsonPath, 'utf-8'));
    } catch(error) {
      if(typeof this.onLoadError === 'function') {
        this.onLoadError(json, 'parse spritesheet .json file failed');
      }

      return false;
    }

    if (data && texture) {
      return await new Promise((resolve) => {
        new PIXI.Spritesheet(
          texture,
          data
        ).parse(resolve);
      });
    }

    return false;
  }

  async loadFont(fnt, image) {
    const fntPath = this._getFilePath(fnt);
    const texture = new PIXI.Texture(await this._loadBaseTexture(image));
    let data = null;

    try {
      data = new DOMParser().parseFromString(this.fs.readFileSync(fntPath, 'utf-8'));
    } catch(error) {
      if(typeof this.onLoadError === 'function') {
        this.onLoadError(fnt, 'parse bitmap font .fnt file failed');
      }

      return false;
    }

    if(data && texture) {
      return PIXI.extras.BitmapText.registerFont(data, texture);
    }

    return false;
  }

  _isFileExt(filepath, ext) {
    const len = filepath.length;

    return filepath.substring(len - ext.length, len) === ext;
  }

  add(id, uri) {
    if(typeof id != 'string') {
      throw new TypeError('"id" should be a string identifer of cached texture, .json file for spritesheet or .fnt xml file for bitmap font');
    }

    const tId = id.trim();

    if(tId.length <= 0) {
      throw new Error('"id" can not be empty');
    }

    let type = ResLoader.RES_TYPE_TEXTURE;

    if(this._isFileExt(tId, '.json')) {
      type = ResLoader.RES_TYPE_SPRITE_SHEET;
    } else if(this._isFileExt(tId, '.fnt')) {
      type = ResLoader.RES_TYPE_BITMAP_FONT;
    }

    this.resources.push({
      id: tId,
      uri: uri.trim(),
      type: type
    });

    return this;
  }

  async _loadAll() {
    const total = this.resources.length;
    let progress = 0;

    for (let i = 0; i < this.resources.length; i++) {
      const resource = this.resources[i];

      if (resource.type === ResLoader.RES_TYPE_TEXTURE) {
        await this.loadTexture(resource.id, resource.uri);
      } else if (resource.type === ResLoader.RES_TYPE_SPRITE_SHEET) {
        await this.loadSpritesheet(resource.id, resource.uri);
      } else if (resource.type === ResLoader.RES_TYPE_BITMAP_FONT) {
        await this.loadFont(resource.id, resource.uri);
      }

      if (typeof this.onLoadProgress === 'function') {
        this.onLoadProgress(resource, ++progress / total);
      }
    }

    if (typeof this.onLoadComplete === 'function') {
      this.onLoadComplete();
    }
  }

  load(options) {
    let loaderOptions = {
      sync : true,
      onError : (file, error) => {
        console.error('Error while loading file "' + file + '", ' + error);
      }
    }

    if(typeof options === 'object') {
      Object.assign(loaderOptions, options);
    }

    if(typeof loaderOptions.onSync === 'function') {
      this.onSyncProgress = loaderOptions.onSync;
    }

    if(typeof loaderOptions.onComplete === 'function') {
      this.onLoadComplete = loaderOptions.onComplete;
    }

    if(typeof loaderOptions.onError === 'function') {
      this.onLoadError = loaderOptions.onError;
    }

    if(typeof loaderOptions.onProgress === 'function') {
      this.onLoadProgress = loaderOptions.onProgress;
    }

    if(loaderOptions.sync) {
      this._sync(() => {
        this._loadAll();
      })
    } else {
      this._loadAll();
    }
  }
}
