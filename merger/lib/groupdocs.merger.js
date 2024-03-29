const path = require('path')
const java = require('java')
const os = require('os')

if (os.platform() === 'darwin') {
  java.options.push('-Djava.awt.headless=true')
}

java.asyncOptions = {
  asyncSuffix: 'Async',
  syncSuffix: '',
}

java.classpath.push(path.join(__dirname, '/groupdocs-merger-nodejs-24.2.jar'))

exports = module.exports

function __typeof__(objClass) {
  if (objClass !== undefined && objClass.constructor) {
    const strFun = objClass.constructor.toString()
    let className = strFun.substr(0, strFun.indexOf('('))
    className = className.replace('function', '')
    return className.replace(/(^\s*)|(\s*$)/gi, '')
  }
  return typeof objClass
}

/** STREAM HELPERS * */
exports.readDataFromStream = function (readStream, callback) {
  const inputStreamBuffer = new exports.StreamBuffer()
  readStream.on('data', chunk => {
    inputStreamBuffer.write(chunk)
  })
  readStream.on('end', () => {
    callback(inputStreamBuffer.toInputStream())
  })
}

exports.readBytesFromStream = function (readStream, callback) {
  const inputStreamBuffer = new exports.StreamBuffer()
  readStream.on('data', chunk => {
    inputStreamBuffer.write(chunk)
  })
  readStream.on('end', () => {
    const array = Array.from(inputStreamBuffer.toByteArray())
    const javaArray = java.newArray('byte', array)
    callback(javaArray)
  })
}

exports.ImageJoinMode = {
	Horizontal : 0,
	Vertical : 1,
},
exports.OrientationMode = {
	Landscape : 1,
	Portrait : 0,
},
exports.RangeMode = {
	AllPages : 0,
	EvenPages : 2,
	OddPages : 1,
},
exports.RotateMode = {
	Rotate180 : 180,
	Rotate270 : 270,
	Rotate90 : 90,
},
exports.SplitMode = {
	Interval : 1,
	Pages : 0,
},
exports.TextSplitMode = {
	Interval : 1,
	Lines : 0,
},
exports.WordJoinMode = {
	Continuous : 1,
	Default : 0,
},

exports.Merger = java.import("com.groupdocs.merger.Merger");
exports.MergerSettings = java.import("com.groupdocs.merger.MergerSettings");
exports.StreamBuffer = java.import("com.groupdocs.merger.contracts.StreamBuffer");
exports.PageBuilder = java.import("com.groupdocs.merger.domain.builders.PageBuilder");
exports.AddPasswordOptions = java.import("com.groupdocs.merger.domain.options.AddPasswordOptions");
exports.ExtractOptions = java.import("com.groupdocs.merger.domain.options.ExtractOptions");
exports.ImageJoinOptions = java.import("com.groupdocs.merger.domain.options.ImageJoinOptions");
exports.JoinOptions = java.import("com.groupdocs.merger.domain.options.JoinOptions");
exports.LoadOptions = java.import("com.groupdocs.merger.domain.options.LoadOptions");
exports.MoveOptions = java.import("com.groupdocs.merger.domain.options.MoveOptions");
exports.OleDiagramOptions = java.import("com.groupdocs.merger.domain.options.OleDiagramOptions");
exports.OlePresentationOptions = java.import("com.groupdocs.merger.domain.options.OlePresentationOptions");
exports.OleSpreadsheetOptions = java.import("com.groupdocs.merger.domain.options.OleSpreadsheetOptions");
exports.OleWordProcessingOptions = java.import("com.groupdocs.merger.domain.options.OleWordProcessingOptions");
exports.OrientationOptions = java.import("com.groupdocs.merger.domain.options.OrientationOptions");
exports.PageBuilderOptions = java.import("com.groupdocs.merger.domain.options.PageBuilderOptions");
exports.PageJoinOptions = java.import("com.groupdocs.merger.domain.options.PageJoinOptions");
exports.PdfAttachmentOptions = java.import("com.groupdocs.merger.domain.options.PdfAttachmentOptions");
exports.PreviewOptions = java.import("com.groupdocs.merger.domain.options.PreviewOptions");
exports.RemoveOptions = java.import("com.groupdocs.merger.domain.options.RemoveOptions");
exports.RotateOptions = java.import("com.groupdocs.merger.domain.options.RotateOptions");
exports.SaveOptions = java.import("com.groupdocs.merger.domain.options.SaveOptions");
exports.SplitOptions = java.import("com.groupdocs.merger.domain.options.SplitOptions");
exports.SwapOptions = java.import("com.groupdocs.merger.domain.options.SwapOptions");
exports.TextSplitOptions = java.import("com.groupdocs.merger.domain.options.TextSplitOptions");
exports.UpdatePasswordOptions = java.import("com.groupdocs.merger.domain.options.UpdatePasswordOptions");
exports.WordJoinOptions = java.import("com.groupdocs.merger.domain.options.WordJoinOptions");
exports.DocumentInfo = java.import("com.groupdocs.merger.domain.result.DocumentInfo");
exports.PageInfo = java.import("com.groupdocs.merger.domain.result.PageInfo");
exports.ArgumentNullException = java.import("com.groupdocs.merger.exception.ArgumentNullException");
exports.GroupDocsException = java.import("com.groupdocs.merger.exception.GroupDocsException");
exports.InvalidOperationException = java.import("com.groupdocs.merger.exception.InvalidOperationException");
exports.LicenseException = java.import("com.groupdocs.merger.exception.LicenseException");
exports.FileCorruptedException = java.import("com.groupdocs.merger.exceptions.FileCorruptedException");
exports.FileTypeNotSupportedException = java.import("com.groupdocs.merger.exceptions.FileTypeNotSupportedException");
exports.GroupDocsMergerException = java.import("com.groupdocs.merger.exceptions.GroupDocsMergerException");
exports.IncorrectPasswordException = java.import("com.groupdocs.merger.exceptions.IncorrectPasswordException");
exports.PasswordRequiredException = java.import("com.groupdocs.merger.exceptions.PasswordRequiredException");
exports.License = java.import("com.groupdocs.merger.licensing.License");
exports.Metered = java.import("com.groupdocs.merger.licensing.metered.Metered");
exports.ConsoleLogger = java.import("com.groupdocs.merger.logging.ConsoleLogger");
exports.CultureInfo = java.import("com.groupdocs.merger.utils.CultureInfo");

exports.FileType = java.import("com.groupdocs.merger.domain.FileType");
exports.PreviewMode = java.import("com.groupdocs.merger.domain.options.PreviewMode");
exports.PathUtils = java.import("com.groupdocs.merger.utils.PathUtils");
exports.Path = java.import("com.groupdocs.merger.utils.common.Path");


exports.StreamBuffer = class StreamBuffer {
  constructor() {
    const self = java.newInstanceSync('com.groupdocs.merger.contracts.StreamBuffer')

    self.write = function (chunk) {
      const array = Array.from(chunk)
      const javaArray = java.newArray('byte', array)
      self.__proto__.write.call(self, javaArray, 0, javaArray.length)
    }
    return self
  }
}

/** STREAM METHODS * */
exports.License.setLicenseFromStream = function (license, licenseStream, callback) {
  const inputStreamBuffer = new exports.StreamBuffer()
  licenseStream.on('data', chunk => {
    inputStreamBuffer.write(chunk)
  })
  licenseStream.on('end', () => {
    let error
    try {
      license.setLicense(inputStreamBuffer.toInputStream())
    } catch (err) {
      error = err
    }
    callback(error)
  })
}
