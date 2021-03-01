"use strict"
const mongoose = require('mongoose');

const host = 'localhost'
const port = '27017'
const database = 'testApp'


const mongooseDb = mongoose.connect(`mongodb://${host}:${port}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(
    () => console.log('MongoDB was successfuly connected'),
    err => console.log(err)
);


const firstSchema = mongoose.Schema({
    country: { type: String, required: true },
    city: { type: String },
    name: { type: String },
    location: {
        ll: { type: Array }
    },
    students: { type: Array }
})

const secondSchema = mongoose.Schema({
    country: { type: String, required: true },
    overallStudents: { type: Number }
})

const first = mongoose.model('first', firstSchema);
const second = mongoose.model('second', secondSchema);

module.exports = {
    first,
    second
}