// this route is for the actual parsing of files from what is uploaded. 
const express = require('express'); 
const parserRoute = express.Router();  
// in this route need to set up multer   
const multer = require('multer'); // multer used for handling file upload from user 
const path = require('path');  // path to get the path at which those files are uploaded
const fs = require('fs'); // file  system module lets us read write and delete and manipulate files

// set destination of where files will be uploaded to. 
const upload = multer({ 
    dest: 'uploads/'
}); 

// set up the route as such for parsing. 
parserRoute.post('/parsefile', upload.single('UserFile'), async (req, res) => { 
    // set up the file object as such where in this case it will be userResume 
    const UserFile = req.file;  // create it as a req object here for data to be read.
    // create an object to getusers keyword as such 
    const client_keyword_Search = req.body; 
    // handle error where if there is no file return a json error as such 
    try { 
        if (!UserFile) { 
            return res.status(400).json({ 
                error: 'No File was Uploaded'
            }); 
        }    

        // do the same for client keyword here as such 
        if (!client_keyword_Search){ 
            return res.status(404).json({ 
                error: "No keyword given Please Enter a keyword"
            }); 
        } 
        
        
        const filePath = path.resolve(UserFile.path); //.this line basically make sure the backend knows the correct local location of the uploaded file — no matter where the app runs from

        // create a async response as such here for the data 
        const data = await fs.promises.readFile(filePath, 'utf-8');  

        // finally handle the response as such for the data to be sent. 
        res.json({ 
            message: 'File uploaded and was read successfully', 
            filename: UserFile.originalname, 
            localPath: UserFile.path, 
            content: data
        }); 
    } catch (error) { 
        console.error('Error handling the file upload', error); 

        res.status(500).json({ 
            error: 'Error handling upload or reading file', 
            details: error.message
        }); 
    }
}); 

module.exports = parserRoute; 