const { exec } = require('child_process');
const util = require('util');
var SesModel = require('./models/sesModel.js');
var path = require('path');
var fs = require('fs');

const execPromise = util.promisify(exec);

//parses pokerstars log and returns json of stats
async function parseLogs(pokerstarsUsername, originalFileName, filePath) {
    try {
        const pythonFilePath = path.join(__dirname, '/python/sessionSearch.py');
        const command = `python ${pythonFilePath} "${pokerstarsUsername}" "${originalFileName}" "${filePath}"`;
        console.log("Command: ", command);
        const { stdout, stderr } = await execPromise(command);

        console.log("Python script return: ", output);

        console.log("Python script return: ", output);
        return stdout;

    } catch (error) {
        console.error("Parsing error");
        return "error";
    }
}

//checks if the same session already exists in db
//deletes .txt log form /public if yes
async function existsDuplicateSession(userId, pokerstarsUsername, file) {
    originalFileName = file.originalname;

    console.log('We are in exists function');

    var count = await SesModel.countDocuments({ userId: userId, pokerstarsUsername: pokerstarsUsername, originalFileName: originalFileName })
    const filePath = path.join(__dirname, 'public/sessionLogs', file.filename);

    console.log('Count of similar documents: ', count);
    if (count > 0) {
        console.log('Session already exists');
        console.log("deleting " + filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath, (err) => {
                if (err) {
                    console.log('Error when deleting session .txt');
                    return "error";
                }
            });

            return true;
        }

    } else {
        console.log('New session');
        return false;
    }
}


module.exports = {
    parseLogs,
    existsDuplicateSession
};