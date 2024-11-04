var SesModel = require('../models/sesModel.js');
var UserModel = require('../models/userModel.js');
const { exec } = require('child_process');
var path = require('path');
const util = require('util');
var logUtil = require('../pokerstarsLogUtils.js');
const { use } = require('../routes/sessionRoutes.js');
var fs = require('fs');

const execPromise = util.promisify(exec);
/**
 * sessionController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * sessionController.stats()
     */
    stats: function (req, res, next) {
        const { start_date, end_date } = req.query;

        SesModel.find({ userId: req.session.userId, date:  {$gte: new Date(start_date), $lte: new Date(end_date)}})
            .populate('userId')
            .sort({ date: 1 })
            .exec(function (err, sessions) {
                if (err) {
                    var err = new Error('Error when gettins sessions');
                    err.status = 500;
                    return next(err);
                }

                return res.json(sessions);
            });
    },


    /**
     * sessionController.listOwn()
     */
    listOwn: function (req, res, next) {
        SesModel.find({ userId: req.session.userId })
            .populate('userId')
            .sort({ date: -1 })
            .exec(function (err, sessions) {
                if (err) {
                    var err = new Error('Error when gettins sessions');
                    err.status = 500;
                    return next(err);
                }

                return res.json(sessions);
            });
    },

    list: function (req, res, next) {
        SesModel.find()
            .populate('userId')
            .sort({ date: -1 })
            .exec(function (err, sessions) {
                if (err) {
                    var err = new Error('Error when gettins sessions');
                    err.status = 500;
                    return next(err);
                }

                return res.json(sessions);
            });
    },
    /**
     * sessionController.upload()
     * 
     * recieves text files and saves them
     * checks if session already exists
     * if yes remove the text file
     * if not run python script and create session json
     * save json to db
     * updates users global stats
     */
    upload: async function (req, res, next) {
        const files = req.files;
        var hands = 0;
        var profit = 0;
        var call = 0;
        var raise = 0;
        var fold = 0;
        var bet = 0;
        var threeBet = 0;
        var showdown = 0;
        var wonShowdown = 0;
        var vpip = 0;
        var pfr = 0;
        var sessions = 0;
        var pokerstarsUsername = req.body.username;
        // error | exists | success
        var results = [];
        var errCount = [0, 0, 0];
        console.log('Username:', pokerstarsUsername);

        if (!files || files.length === 0) {
            var err = new Error('No uploaded files');
            err.status = 400;
            return next(err);
        }

        //Create an array of promises for parsing and saving each file
        const promises = files.map(async (file) => {
            try {
                console.log('Og filename:', file.originalname);
                const filePath = path.join(__dirname, '..', 'public/sessionLogs', file.filename);
                console.log('Uploaded file:', filePath);

                //Check if duplicate files already exist in database
                var existsDuplicate = await logUtil.existsDuplicateSession(req.session.userId, pokerstarsUsername, file);
                console.log("Duplicates: ", existsDuplicate);

                if (existsDuplicate == "error") {
                    results.push({ file: file.originalname, status: "Error when uploading file" });
                    errCount[0]++;
                }
                else if (existsDuplicate) {
                    results.push({ file: file.originalname, status: "Session already exists" });
                    errCount[1]++;
                }
                else {
                    //Run python script to parse session to json
                    const pythonFilePath = path.join(__dirname, '../python/sessionSearch.py');
                    const command = `python ${pythonFilePath} "${pokerstarsUsername}" "${file.originalname}" "${filePath}"`;
                    console.log("Command: ", command);
                    const { stdout, stderr } = await execPromise(command);

                    if (stderr) {
                        results.push({ file: file.originalname, status: "Error when uploading file" });
                        errCount[0]++;
                    }
                    else {
                        console.log("Python script return: ", stdout);
                        var json = stdout;

                        if (json == "error") {
                            results.push({ file: file.originalname, status: "Error when uploading file" });
                            errCount[0]++;
                            console.log("Wrong username or log file");
                            console.log("deleting " + filePath);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath)
                            }
                        }

                        else {
                            //save session to db
                            console.log("Json parse");
                            var sessionObj = await JSON.parse(json);
                            console.log(sessionObj.date)
                            var dateString = sessionObj.date;

                            // remove "ET" and convert it to a valid ISO format
                            const dateWithoutTimezone = dateString.replace(" ET", "");
                            const isoDateString = new Date(dateWithoutTimezone).toISOString();

                            console.log("Creating ses model");
                            var session = new SesModel({
                                originalFileName: file.originalname,
                                tableName: sessionObj.name,
                                type: sessionObj.type,
                                date: isoDateString,
                                filePath: '/sessionLogs/' + file.filename,
                                pokerstarsUsername: pokerstarsUsername,
                                blinds: (sessionObj.sb + "-" + sessionObj.bb + " " + sessionObj.currency),
                                bb: sessionObj.bb,
                                userId: req.session.userId,
                                hands: sessionObj.hands,
                                profit: sessionObj.profit,
                                bbprofit: sessionObj.profit_blinds,
                                call: sessionObj.call,
                                raise: sessionObj.raised,
                                fold: sessionObj.fold,
                                bet: sessionObj.bet,
                                threeBet: sessionObj.threeBet,
                                showdown: sessionObj.showdown,
                                wonShowdown: sessionObj.wonShowdown,
                                vpip: sessionObj.vpip,
                                pfr: sessionObj.pfr,
                                agg_percent: sessionObj.agg_percent,
                                wtsd_percent: sessionObj.wtsd_percent,
                                wonsd_percent: sessionObj.wonSD_percent,
                                vpip_percent: sessionObj.vpip_percent,
                                pfr_percent: sessionObj.pfr_percent,

                            });

                            console.log("Before save");
                            var ses = await session.save();
                            console.log("save res: ", ses);
                            console.log("After save");
                            console.log("Incremeting temp stats");
                            hands += ses.hands;
                            profit += ses.profit;
                            call += ses.call;
                            raise += ses.raise;
                            fold += ses.fold;
                            bet += ses.bet;
                            threeBet += ses.threeBet;
                            showdown += ses.showdown;
                            wonShowdown += ses.wonShowdown;
                            vpip += ses.vpip;
                            pfr += ses.pfr;
                            sessions++;

                            console.log("File successfully uploaded");
                            results.push({ file: file.originalname, status: "File uploaded" });
                            errCount[2]++;
                        }
                    }
                }

            } catch (error) {
                // If an error occurs, return failure
                results.push({ file: file.originalname, status: "Error when uploading file", error: error.message });
                errCount[0]++;
            }
        });

        await Promise.allSettled(promises);

        //update user stats
        UserModel.findOne({ _id: req.session.userId }, function (err, user) {
            if (!err && user) {
                console.log("User: ", user, " Counted hands: ", hands);
                user.hands += hands;
                console.log("User hands after hands: ", user.hands);
                user.profit += profit;
                user.call += call;
                user.raise += raise;
                user.fold += fold;
                user.bet += bet;
                user.threeBet += threeBet;
                user.showdown += showdown;
                user.wonShowdown += wonShowdown;
                user.vpip += vpip;
                user.sessions += sessions;
                user.pfr += pfr;

                user.save();
            }
        });

        console.log("Results: ", results);
        
        // Send the response back to the client
        return res.status(200).json({
            error: errCount[0],
            exists: errCount[1],
            succes: errCount[2]
        });
    },
    /**
     * sessionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        SesModel.findByIdAndRemove(id, function (err, session) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the session.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
