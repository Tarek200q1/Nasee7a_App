import multer from "multer"
import fs from "node:fs"
import { allowedFileExtensions, fileTypes } from "../Common/constants/files.constants.js"



function checkOrCreateFolder(folderPath){
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath , {recursive:true})
    }
}


export const localUpload = ({
    folderPath = 'samples'
})=>{
    const storage = multer.diskStorage({
        destination: (req, file , cb)=>{
            const fileDir = `uploads/${folderPath}`
            checkOrCreateFolder(fileDir)
            cb(null , fileDir)
        },
        filename: (req , file , cb)=>{
            console.log(`file info before uploading ${file}`);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null , `${uniqueSuffix}__${file.originalname}`)
        }
    })

    const fileFilter = (req , file , cb)=>{
        const fileKey = file.mimetype.split('/')[0].toUpperCase()
        const fileType = fileTypes[fileKey]
        if(!fileType) return cb(new Error('Invalid file type') , false)

        const fileExtension = file.mimetype.split('/')[1]
        if(!allowedFileExtensions[fileType].includes(fileExtension)) return cb(new Error('Invalid file extension') , false)
        
        return cb(null , true)
    }
    return multer({ fileFilter , storage})
}