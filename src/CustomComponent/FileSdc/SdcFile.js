import {Components} from "@formio/js";
import editForm from './SdcFile.form'
import {uniqueName} from 'formiojs/utils/utils';
import axios from "axios";
import fileProcessor from 'formiojs/providers/processor/fileProcessor';
let Camera;
let webViewCamera = 'undefined' !== typeof window ? navigator.camera : Camera;
const FileComponent = Components.components.file;

const endpoint = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1] + "/it"
const language = document.documentElement.lang.toString();
let signatureCheckWsUrl = null;
if (document.querySelector("#formio") !== null) {
  signatureCheckWsUrl = document.querySelector("#formio").dataset.signature_check_ws_url;
}


export default class SdcFile extends FileComponent {

  constructor(component, options, data) {
    super(component, options, data);
    if (this.component.check_signature) {
      if(!this.validators){
        this.validators = [];
        this.validators.push('custom');
      }else{
        this.validators.push('custom');
      }

      component.validate.custom = "valid = instance.signatureValidation()"
    }
  }

  static schema() {
    return FileComponent.schema({
      type: 'sdcfile'
    });
  }

  builderInfo = {
    title: 'File Sdc',
    group: 'basic',
    icon: 'fa fa-file',
    weight: 70,
    schema: SdcFile.schema()
  }

  static editForm = editForm

  signatureValidation(input) {
    let valitationResult = true;
    if (this.dataValue.length > 0) {
      this.dataValue.forEach((item, index, arr) => {
        if (item.signature_validation === 'none') {
          //valitationResult = 'Il file ' + item.originalName +  ' non presenta una firma valida.'
          valitationResult = 'pratica.error_signature_validation';
        }
      })
    }
    return valitationResult;
  }



  /**
   * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
   * elements to attach functionality to.
   *
   * @param element
   * @returns {Promise}
   */
  attach(element) {
    this.loadRefs(element, {
      fileDrop: 'single',
      fileBrowse: 'single',
      galleryButton: 'single',
      cameraButton: 'single',
      takePictureButton: 'single',
      toggleCameraMode: 'single',
      videoPlayer: 'single',
      fileLink: 'multiple',
      removeLink: 'multiple',
      fileToSyncRemove: 'multiple',
      fileImage: 'multiple',
      fileType: 'multiple',
      fileProcessingLoader: 'single',
      syncNow: 'single',
      restoreFile: 'multiple',
      progress: 'multiple',
    });
    // Ensure we have an empty input refs. We need this for the setValue method to redraw the control when it is set.
    this.refs.input = [];
    const superAttach = super.attach(element);

    if (this.refs.fileDrop) {
      // if (!this.statuses.length) {
      //   this.refs.fileDrop.removeAttribute('hidden');
      // }
      const _this = this;
      this.addEventListener(this.refs.fileDrop, 'dragover', function(event) {
        this.className = 'fileSelector fileDragOver';
        event.preventDefault();
      });
      this.addEventListener(this.refs.fileDrop, 'dragleave', function(event) {
        this.className = 'fileSelector';
        event.preventDefault();
      });
      this.addEventListener(this.refs.fileDrop, 'drop', function(event) {
        this.className = 'fileSelector';
        event.preventDefault();
        _this.handleFilesToUpload(event.dataTransfer.files);
      });
    }

    this.addEventListener(element, 'click', (event) => {
      this.handleAction(event);
    });

    if (this.refs.fileBrowse) {
      this.addEventListener(this.refs.fileBrowse, 'click', (event) => {
        event.preventDefault();
        this.browseFiles(this.browseOptions)
            .then((files) => {
              this.handleFilesToUpload(files);
            });
      });
    }

    this.refs.fileLink.forEach((fileLink, index) => {
      this.addEventListener(fileLink, 'click', (event) => {
        event.preventDefault();
        this.getFile(this.dataValue[index]);
      });
    });

    this.refs.removeLink.forEach((removeLink, index) => {
      this.addEventListener(removeLink, 'click', (event) => {
        event.preventDefault();
        const fileInfo = this.dataValue[index];
        this.handleFileToRemove(fileInfo);
      });
    });

    this.refs.fileToSyncRemove.forEach((fileToSyncRemove, index) => {
      this.addEventListener(fileToSyncRemove, 'click', (event) => {
        event.preventDefault();
        this.filesToSync.filesToUpload.splice(index, 1);
        this.redraw();
      });
    });

    this.refs.restoreFile.forEach((fileToRestore, index) => {
      this.addEventListener(fileToRestore, 'click', (event) => {
        event.preventDefault();
        const fileInfo = this.filesToSync.filesToDelete[index];
        delete fileInfo.status;
        delete fileInfo.message;
        this.filesToSync.filesToDelete.splice(index, 1);
        this.dataValue.push(fileInfo);
        this.triggerChange();
        this.redraw();
      });
    });

    if (this.refs.galleryButton && webViewCamera) {
      this.addEventListener(this.refs.galleryButton, 'click', (event) => {
        event.preventDefault();
        webViewCamera.getPicture((success) => {
          window.resolveLocalFileSystemURL(success, (fileEntry) => {
                fileEntry.file((file) => {
                  const reader = new FileReader();
                  reader.onloadend = (evt) => {
                    const blob = new Blob([new Uint8Array(evt.target.result)], { type: file.type });
                    blob.name = file.name;
                    this.handleFilesToUpload([blob]);
                  };
                  reader.readAsArrayBuffer(file);
                });
              }
          );
        }, (err) => {
          console.error(err);
        }, {
          sourceType: webViewCamera.PictureSourceType.PHOTOLIBRARY,
        });
      });
    }

    if (this.refs.cameraButton && webViewCamera) {
      this.addEventListener(this.refs.cameraButton, 'click', (event) => {
        event.preventDefault();
        webViewCamera.getPicture((success) => {
          window.resolveLocalFileSystemURL(success, (fileEntry) => {
                fileEntry.file((file) => {
                  const reader = new FileReader();
                  reader.onloadend = (evt) => {
                    const blob = new Blob([new Uint8Array(evt.target.result)], { type: file.type });
                    blob.name = file.name;
                    this.handleFilesToUpload([blob]);
                  };
                  reader.readAsArrayBuffer(file);
                });
              }
          );
        }, (err) => {
          console.error(err);
        }, {
          sourceType: webViewCamera.PictureSourceType.CAMERA,
          encodingType: webViewCamera.EncodingType.PNG,
          mediaType: webViewCamera.MediaType.PICTURE,
          saveToPhotoAlbum: true,
          correctOrientation: false,
        });
      });
    }

    if (this.refs.takePictureButton) {
      this.addEventListener(this.refs.takePictureButton, 'click', (event) => {
        event.preventDefault();
        this.takePicture();
      });
    }

    if (this.refs.toggleCameraMode) {
      this.addEventListener(this.refs.toggleCameraMode, 'click', (event) => {
        event.preventDefault();
        this.cameraMode = !this.cameraMode;
        this.redraw();
      });
    }

    this.refs.fileType.forEach((fileType, index) => {
      if (!this.dataValue[index]) {
        return;
      }

      this.dataValue[index].fileType = this.dataValue[index].fileType || this.component.fileTypes[0].label;

      this.addEventListener(fileType, 'change', (event) => {
        event.preventDefault();

        const fileType = this.component.fileTypes.find((typeObj) => typeObj.value === event.target.value);

        this.dataValue[index].fileType = fileType.label;
      });
    });

    this.addEventListener(this.refs.syncNow, 'click', (event) => {
      event.preventDefault();
      this.syncFiles();
    });

    const fileService = this.fileService;
    if (fileService) {
      const loadingImages = [];
      this.filesReady = new Promise((resolve, reject) => {
        this.filesReadyResolve = resolve;
        this.filesReadyReject = reject;
      });
      this.refs.fileImage.forEach((image, index) => {
        loadingImages.push(this.loadImage(this.dataValue[index]).then((url) => (image.src = url)));
      });
      if (loadingImages.length) {
        Promise.all(loadingImages).then(() => {
          this.filesReadyResolve();
        }).catch(() => this.filesReadyReject());
      }
      else {
        this.filesReadyResolve();
      }
    }
    this.refs.fileProcessingLoader.style.display = 'none';
    return superAttach;
  }

  /**
   * Get the value of the component from the dom elements.
   *
   * @returns {Array}
   */
  getValue() {
    return this.dataValue;
  }

  get defaultValue() {
    const value = super.defaultValue;
    return Array.isArray(value) ? value : [];
  }


  /**
   * Set the value of the component into the dom elements.
   *
   * @param value
   * @returns {boolean}
   */
  //setValue(value) {}
  async upload() {
    debugger
    if (!this.filesToSync.filesToUpload.length) {
      return Promise.resolve();
    }

    return await Promise.all(this.filesToSync.filesToUpload.map(async(fileToSync) => {
      debugger
      let fileInfo = null;
      try {
        if (fileToSync.isValidationError) {
          return {
            fileToSync,
            fileInfo,
          };
        }

        fileInfo = await this.uploadFile(fileToSync);
        fileToSync.status = 'success';
        fileToSync.message = this.t('Succefully uploaded');

        fileInfo.originalName = fileToSync.originalName;
        fileInfo.hash = fileToSync.hash;
      }
      catch (response) {
        fileToSync.status = 'error';
        delete fileToSync.progress;
        fileToSync.message = typeof response === 'string'
            ? response
            : response.type === 'abort'
                ? this.t('Request was aborted')
                : response.toString();
      }
      finally {
        delete fileToSync.progress;
        this.redraw();
      }

      return {
        fileToSync,
        fileInfo,
      };
    }));
  }


/*  upload(files) {

    // Only allow one upload if not multiple.
    if (!this.component.multiple) {
      files = Array.prototype.slice.call(files, 0, 1);
    }
    if (this.component.storage && files && files.length) {
      this.fileDropHidden = true;

      // files is not really an array and does not have a forEach method, so fake it.
      Array.prototype.forEach.call(files, async (file) => {
        const fileName = uniqueName(file.name, this.component.fileNameTemplate, this.evalContext());
        let fileUpload = {
          name: fileName,
          original_filename: file.name,
          size: file.size,
          status: 'info',
          message: this.t('Starting upload'),
          protocol_required: this.component.protocol_required,
          mime_type: file.type
        };

        // Check if file with the same name is being uploaded
        const fileWithSameNameUploaded = this.dataValue.some(fileStatus => fileStatus.originalName === file.name);
        const fileWithSameNameUploadedWithError = this.statuses.findIndex(fileStatus =>
          fileStatus.originalName === file.name
          && fileStatus.status === 'error'
        );
        if (fileWithSameNameUploaded) {
          fileUpload.status = 'error';
          fileUpload.message = this.t('File with the same name is already uploaded');
        }

        if (fileWithSameNameUploadedWithError !== -1) {
          this.statuses.splice(fileWithSameNameUploadedWithError, 1);
          this.redraw();
        }

        // Check file pattern
        if (this.component.filePattern && !this.validatePattern(file, this.component.filePattern)) {
          fileUpload.status = 'error';
          fileUpload.message = this.t('File is the wrong type; it must be {{ pattern }}', {
            pattern: this.component.filePattern,
          });
        }
        // Check file minimum size
        if (this.component.fileMinSize && !this.validateMinSize(file, this.component.fileMinSize)) {
          fileUpload.status = 'error';
          fileUpload.message = this.t('File is too small; it must be at least {{ size }}', {
            size: this.component.fileMinSize,
          });
        }

        // Check file maximum size
        if (this.component.fileMaxSize && !this.validateMaxSize(file, this.component.fileMaxSize)) {
          fileUpload.status = 'error';
          fileUpload.message = this.t('File is too big; it must be at most {{ size }}', {
            size: this.component.fileMaxSize,
          });
        }

        // Get a unique name for this file to keep file collisions from occurring.
        const dir = this.interpolate(this.component.dir || '');
        const {fileService} = this;
        if (!fileService) {
          fileUpload.status = 'error';
          fileUpload.message = this.t('File Service not provided.');
        }
        this.statuses.push(fileUpload);
        this.fileDropHidden = false;
        this.redraw();
debugger
        if (fileUpload.status !== 'error') {
          if (this.component.privateDownload) {
            file.private = true;
          }
          const {storage, options = {}} = this.component;
          const url = endpoint + '/upload';
          let groupKey = null;
          let groupPermissions = null;

          //Iterate through form components to find group resource if one exists
          this.root.everyComponent((element) => {
            if (element.component?.submissionAccess || element.component?.defaultPermission) {
              groupPermissions = !element.component.submissionAccess ? [
                {
                  type: element.component.defaultPermission,
                  roles: [],
                },
              ] : element.component.submissionAccess;

              groupPermissions.forEach((permission) => {
                groupKey = ['admin', 'write', 'create'].includes(permission.type) ? element.component.key : null;
              });
            }
          });

          const fileKey = this.component.fileKey || 'file';
          const groupResourceId = groupKey ? this.currentForm.submission.data[groupKey]._id : null;
          debugger
          let processedFile = null;
          if (this.root.options.fileProcessor) {
            try {
              if (this.refs.fileProcessingLoader) {
                this.refs.fileProcessingLoader.style.display = 'block';
              }
              // eslint-disable-next-line no-undef
              const fileProcessorHandler = fileProcessor(this.fileService, this.root.options.fileProcessor);
              processedFile = await fileProcessorHandler(file, this.component.properties);
            } catch (err) {
              fileUpload.status = 'error';
              fileUpload.message = this.t('File processing has been failed.');
              this.fileDropHidden = false;
              this.redraw();
              return;
            } finally {
              if (this.refs.fileProcessingLoader) {
                this.refs.fileProcessingLoader.style.display = 'none';
              }
            }
          }

          fileUpload.message = this.t('Starting upload.');
          this.redraw();
          console.log('fileUpload',fileUpload)

          let idUpload;
          axios.post(url, fileUpload, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          })
            .then((fileInfo) => {
              idUpload = fileInfo.data.id
              fileUpload.status = 'progress';
              fileUpload.progress = parseInt(0);
              /!*const formData = new FormData();
              formData.append('file', file)*!/
              console.log('fileinfo1',fileInfo)
              console.log('file',file)
              axios.put(fileInfo.data.uri, file, {
                onUploadProgress: progressEvent => {
                  let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  fileUpload.progress = parseInt(percentCompleted);
                  fileUpload.status = 'progress';
                  delete fileUpload.message;
                  this.fileDropHidden = false;
                  this.redraw();
                  this.triggerChange();
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {'Content-Type': 'multipart/form-data'}

              }).then(response => {
                const regex = /\\|"/gi;
                const etag = response.headers.etag.replace(regex, '') || null

                const index = this.statuses.indexOf(fileUpload);
                if (index !== -1) {
                  this.statuses.splice(index, 1);
                }

                fileInfo.originalName = file.name;
                fileInfo.name = fileUpload.name;
                fileInfo.size = fileUpload.size;
                fileInfo.mime_type = fileUpload.mime_type
                fileInfo.url = endpoint + "/allegati/"+ idUpload
                fileInfo.data.baseUrl = endpoint + "/allegati/"+ idUpload
                fileInfo.storage = 'url'
                fileInfo.protocol_required = fileUpload.protocol_required
                fileInfo.signature_validation = null

                if (!this.hasValue()) {
                  this.dataValue = [];
                }
                let  fileIndex = this.dataValue.push(fileInfo) -1;

                axios.put(endpoint + '/upload/' + idUpload, {
                  file_hash: etag,
                  check_signature: this.component.check_signature
                }).then(resp => {
                  this.redraw();
                  this.triggerChange();
                  if (this.component.check_signature && resp.data.url && signatureCheckWsUrl) {
                    axios.post(signatureCheckWsUrl, {
                      url: resp.data.url,
                      content: null
                    }, {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }).then(resp => {
                      console.log(resp)
                      fileInfo.signature_validation = resp.data.sign;
                      this.dataValue[fileIndex] = fileInfo
                    }).catch(e => {
                      fileInfo.signature_validation = 'File validation error: ' + e;
                      this.dataValue[fileIndex] = fileInfo
                    })
                    this.redraw();
                    this.triggerChange();
                  }
                }).catch(err => {
                  fileUpload.status = 'error';
                  fileUpload.message = 'pratica.error_upload_file_sdc'
                  delete fileUpload.progress;
                  this.fileDropHidden = false;
                  this.redraw();
                  this.triggerChange();
                })
              }).catch(err => {

                console.log('fileInfo2',fileInfo)
                console.log(err)
                console.log('fileUpload2',fileUpload)

                fileUpload.status = 'error';
                fileUpload.message = 'pratica.error_upload_file_sdc'
                delete fileUpload.progress;
                this.fileDropHidden = false;
                this.redraw();
                this.triggerChange();
              })
            })
            .catch((response) => {
              console.log(response)
              console.log('fileUpload',fileUpload)
              fileUpload.status = 'error';
              if (response.response.status === 400) {
                fileUpload.message = 'pratica.error_extension_file_sdc'
              } else {
                fileUpload.message = 'pratica.error_upload_file_sdc'
              }
              delete fileUpload.progress;
              this.fileDropHidden = false;
              this.redraw();
              this.triggerChange();
            });
        }
      });
    }
  }*/


  fileReader(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(reader.result)
      };

      reader.readAsArrayBuffer(file)
    })
  }
}
