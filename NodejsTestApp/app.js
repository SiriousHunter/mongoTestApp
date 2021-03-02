'use strict';
const fs = require('fs')
//STEP #1
const { first, second } = require('./db')

var firstDataSet =  fs.readFileSync(__dirname + "/sources/first.json").toString();
var secondDataSet =  fs.readFileSync(__dirname + "/sources/second.json").toString();


(async function () {
    try {
        await first.remove()
        await second.remove()
       

        //STEP #2
        await first.insertMany(JSON.parse(firstDataSet), { upsert: true })
        await second.insertMany(JSON.parse(secondDataSet, { upsert: true }))

        //STEP #3
        await first.aggregate([
            {
                $lookup:
                {
                    from: "seconds",
                    localField: "country",
                    foreignField: "country",
                    as: "seconds"
                }
            },
            {
                $addFields:
                {
                    
                    studentsDiff: {
                        $let: {
                            vars: {
                                diff: { $max: "$students" }
                            },
                            in: { $subtract: ["$$diff.number", { $arrayElemAt: ["$seconds.overallStudents", 0] }] }
                        }

                    },
                    longitude: { $arrayElemAt: ["$location.ll", 0] },
                    latitude: { $arrayElemAt: ["$location.ll", 1] }
                }
            },
            { $replaceWith: "$$ROOT" },
            { $project: { "seconds": 0 } },
            {
                $group:
                {
                    _id: "$country",
                    allDiffs: { $push: "$studentsDiff" },
                    count: { $sum: 1 },
                    longitude: { $push: "$longitude" },
                    latitude: { $push: "$latitude" },
                }
            },
            { $out: "third" }
        ])



    } catch (err) {
        console.log(err.toString())
    }
    
})()

