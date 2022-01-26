let AWSController = function () { };
import Jimp from "jimp";
import async from "async";
import fs from "fs";
import formidable from "formidable";
import os from "os";
import uuid from "uuid";
import config from "../config/config";
import ApiMessages from "../config/ApiMessages";
import CommonController from "./CommonController";
import Images from "../models/Images";
import knox from "knox";
import s3 from "aws-sdk/clients/s3";
import Files from "../models/Files";
import QRCode from 'qrcode';
let knoxClient = knox.createClient({
    key: config.S3AccessKey,
    secret: config.S3Secret,
    bucket: config.S3Bucket
});
let S3 = new s3({
    credentials: {
        accessKeyId: config.S3AccessKey,
        secretAccessKey: config.S3Secret
    },
    region: config.S3Region
});


AWSController.UploadFileAWS = (nfile, fname, contentType) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let buf = await fs.readFileSync(nfile);
                let params = {
                    Body: buf,
                    Bucket: config.AWS.S3Bucket,
                    Key: fname,
                    ContentType: contentType,
                    ContentLength: buf.length
                };
                S3.putObject(params, async (err, data) => {
                    if (err) {
                        console.error(err, err.stack);
                        reject("AWS Upload Fails");
                    } else {
                        fs.unlinkSync(nfile);
                        resolve({ success: true, extras: { Status: "UPLOADED SUCCESSFULLY" } });
                    }
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


// AWSController.UploadFileAWS = (nfile, fname, contentType) => {
//     return new Promise((resolve, reject) => {
//         setImmediate(async () => {
//             try {
//                 let buf = await fs.readFileSync(nfile);
//                 let req = knoxClient.put(fname, {
//                     'Content-Length': buf.length,
//                     'Content-Type': contentType
//                 });
//                 req.on('response', (rest) => {
//                     if (rest.statusCode == 200) {
//                         // Delete the Local File
//                         fs.unlinkSync(nfile);
//                         resolve({ success: true, extras: { Status: "Uploaded Successfully" } });
//                     } else {
//                         fs.unlinkSync(nfile);

//                         console.error(`Image upload fails ${rest.statusCode}`)
//                         reject("AWS Upload Fails");
//                     }
//                 });
//                 req.end(buf);
//             } catch (error) {
//                 reject(await CommonController.Common_Error_Handler(error));
//             }
//         });
//     });
// }

AWSController.DeleteAWSImage = fname => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let params = {
                    Bucket: config.S3Bucket,
                    Delete: { // required
                        Objects: [ // required
                            {
                                Key: fname // required
                            }
                        ]
                    }
                };
                S3.deleteObjects(params, (err, data) => {
                    resolve('Deleted Successfully');
                });
            } catch (error) {
                console.error(error);
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AWSController.Upload_Image = (req, res) => {
    let generateFilename = (type) => {
        let date = new Date().getTime();
        let charBank = "abcdefghijklmnopqrstuvwxyz";
        let fstring = '';
        for (let i = 0; i < 15; i++) {
            fstring += charBank[parseInt(Math.random() * charBank.length)];
        }
        return (fstring += date + '_' + type);
    }
    let values, tmpFile;
    let filename, filesplit, extension, contentType;
    let newForm = formidable.IncomingForm();
    let nfile_50, nfile_100, nfile_250, nfile_550, nfile_900, nfile_Original;
    let Image50, Image100, Image250, Image550, Image900, ImageOriginal;
    let size;
    newForm.keepExtensions = true;
    newForm.parse(req, (err, fields, files) => {
        values = JSON.parse(JSON.stringify(fields));
        Image50 = generateFilename('050');
        Image100 = generateFilename('100');
        Image250 = generateFilename('250');
        Image550 = generateFilename('550');
        Image900 = generateFilename('900');
        ImageOriginal = generateFilename('Original');
        tmpFile = files.image.path;
        filename = files.image.name;
        filesplit = filename.split('.');
        contentType = files.image.type;
        size = files.image.size;
    });
    newForm.on('end', () => {
        if (size <= config.Image_Size) {
            if (filesplit.length > 1) {
                extension = filesplit[(filesplit.length) - 1];
                let ImageID = uuid.v4();
                Image50 = `${Image50}.${extension}`;
                Image100 = `${Image100}.${extension}`;
                Image250 = `${Image250}.${extension}`;
                Image550 = `${Image550}.${extension}`;
                Image900 = `${Image900}.${extension}`;
                ImageOriginal = `${ImageOriginal}.${extension}`;

                nfile_50 = `${os.tmpdir()}/${Image50}`;
                nfile_100 = `${os.tmpdir()}/${Image100}`;
                nfile_250 = `${os.tmpdir()}/${Image250}`;
                nfile_550 = `${os.tmpdir()}/${Image550}`;
                nfile_900 = `${os.tmpdir()}/${Image900}`;
                nfile_Original = `${os.tmpdir()}/${ImageOriginal}`;
                let Data = {
                    ImageID: ImageID,
                    Image50: Image50,
                    Image100: Image100,
                    Image250: Image250,
                    Image550: Image550,
                    Image900: Image900,
                    ImageOriginal: ImageOriginal,
                    contentType: contentType,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                Images(Data).save();
                res.json({
                    success: true,
                    extras: {
                        Status: "Image Uploaded Successfully",
                        ImageID: ImageID,
                        Image50: config.S3URL + Image50,
                        Image100: config.S3URL + Image100,
                        Image250: config.S3URL + Image250,
                        Image550: config.S3URL + Image550,
                        Image900: config.S3URL + Image900,
                        ImageOriginal: config.S3URL + ImageOriginal
                    }
                })

                fs.rename(tmpFile, nfile_Original, () => {
                    let ResizeData = [
                        {
                            width: 50,
                            fname: Image50,
                            nfile: nfile_50
                        },
                        {
                            width: 100,
                            fname: Image100,
                            nfile: nfile_100
                        }, {
                            width: 250,
                            fname: Image250,
                            nfile: nfile_250
                        }, {
                            width: 550,
                            fname: Image550,
                            nfile: nfile_550
                        }, {
                            width: 900,
                            fname: Image900,
                            nfile: nfile_900
                        }
                    ];
                    async.eachSeries(ResizeData, (item, callback) => {
                        Jimp.read(nfile_Original, (err, image) => {
                            image.resize(item.width, Jimp.AUTO)
                                .quality(100)
                                .write(item.nfile, (err, Result) => {
                                    //now upload it to AWS and unlink the image
                                    AWSController.UploadFileAWS(item.nfile, item.fname, contentType).then((UploadStatus) => {
                                        callback();
                                    }).catch((err) => console.error(err));
                                })
                        });
                    }, (err) => {
                        AWSController.UploadFileAWS(nfile_Original, ImageOriginal, contentType).then((UploadStatus) => {

                        }).catch((err) => console.error(err));
                    });
                })
            } else {
                res.json({ success: false, extras: { msg: ApiMessages.INVALID_FILE } });
                AWSController.Remove_Local_File(tmpFile).then((RemoveStatus) => {
                }).catch((err) => console.error(err));
            }
        } else {
            res.json({ success: false, extras: { msg: ApiMessages.REQUEST_SIZE_EXCEEDED } });
            AWSController.Remove_Local_File(tmpFile).then((RemoveStatus) => {
            }).catch((err) => console.error(err));
        }
    })
}
AWSController.Remove_Local_File = (nfile) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                await fs.unlinkSync(nfile);
                resolve({ success: true, extras: { Status: "Local File Removed Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AWSController.Upload_File = (req, res) => {
    let generateFilename = () => {
        let date = new Date().getTime();
        let charBank = "abcdefghijklmnopqrstuvwxyz";
        let fstring = '';
        for (let i = 0; i < 15; i++) {
            fstring += charBank[parseInt(Math.random() * charBank.length)];
        }
        return (fstring += date);
    }
    let values, tmpFile;
    let filename, filesplit, extension, contentType;
    let newForm = formidable.IncomingForm();
    let nfile_Original;
    let Document_URL;
    let contentSize;

    newForm.keepExtensions = true;
    newForm.parse(req, (err, fields, files) => {
        values = JSON.parse(JSON.stringify(fields));
        Document_URL = generateFilename();
        tmpFile = files.file.path;
        filename = files.file.name;
        filesplit = filename.split('.');
        let contType = JSON.stringify(fields.contentType);
        contentType = files.file.type;;
        contentSize = files.file.size;
    });
    newForm.on('end', () => {
        if (contentSize <= config.File_Size) {
            if (filesplit.length > 1) {
                extension = filesplit[(filesplit.length) - 1];
                let DocumentID = uuid.v4();
                Document_URL = `${Document_URL}.${extension}`;
                nfile_Original = `${os.tmpdir()}/${Document_URL}`;
                let Data = {
                    FileID: DocumentID,
                    File_Path: Document_URL,
                    contentType: contentType,
                    contentSize: contentSize,
                    created_at: new Date(),
                    updated_at: new Date()
                }

                Files(Data).save();

                fs.rename(tmpFile, nfile_Original, () => {
                    AWSController.UploadFileAWS(nfile_Original, Document_URL, contentType).then((UploadStatus) => {
                        if (UploadStatus == "AWS Upload Fails") {
                            res.json({ success: false, extras: { Status: "Update Failed" } });
                        } else {

                            res.json({
                                success: true,
                                extras: {
                                    Status: "File Uploaded Successfully",
                                    FileID: DocumentID,
                                    contentType: contentType,
                                    contentSize: contentSize,
                                    File_Path: config.S3URL + Document_URL
                                }
                            });
                        }

                    }).catch((err) => console.error(err));
                })
            } else {
                res.json({ success: false, extras: { msg: ApiMessages.INVALID_FILE } });
                AWSController.Remove_Local_File(tmpFile).then((RemoveStatus) => {
                }).catch((err) => console.error(err));
            }
        } else {
            res.json({ success: false, extras: { msg: ApiMessages.REQUEST_SIZE_EXCEEDED } });
            AWSController.Remove_Local_File(tmpFile).then((RemoveStatus) => {
            }).catch((err) => console.error(err));
        }
    })
}

AWSController.Upload_FILE_AWS = (nfile, fname, contentType) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let buf = await fs.readFileSync(nfile);
                let req = knoxClient.put(fname, {
                    'Content-Length': buf.length,
                    'Content-Type': contentType
                });
                req.on('response', (rest) => {
                    if (rest.statusCode == 200) {
                        // Delete the Local File
                        fs.unlinkSync(nfile);
                        resolve({ success: true, extras: { Status: "Uploaded Successfully" } });
                    } else {
                        console.error(`Image upload fails ${rest.statusCode}`)
                        reject("AWS Upload Fails");
                    }
                });
                req.end(buf);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AWSController.QRCode_File_From_UUID = (UUID, fname) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let contentType = "image/png";
                let path = `${os.tmpdir()}/fname`;
                let QROptions = {
                    color: {
                        dark: '#000000',
                    },
                    errorCorrectionLevel: 'H',
                    type: 'image/jpeg',
                    quality: 1,
                    margin: 1,
                    width: 160
                }
                let QRFile = await QRCode.toFile(path, UUID, QROptions);
                let Result = await AWSController.UploadFileAWS(path, fname, contentType);
                resolve(Result);
            } catch (error) {
                console.error(error);
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

export default AWSController;