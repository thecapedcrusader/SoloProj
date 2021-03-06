const path = require('path');
const express = require('express');
const app = express();

const drawingModel = require('./models/drawingModel.js');
// import Drawing from './models/drawingModel.js';

const PORT = 3000;

app.use('/build', express.static(path.join(__dirname, '../build')));
app.use(express.json());

// port number, proxy server
//app.use urlencoded, cookie-parser, express() (JSON)

/*
 * create an application that is able to draw on videos where the video is an INPUT by the USER CLIENT
 * create rooms/video, read rooms/video, update rooms/users+videos, delete rooms/videos
 * 
 */

//proxy server

// insights.gg
//change this.props in maincontainer
    //newlocation for links
// /login, ./signup -- authentication
// https://developers.google.com/youtube/player_parameters

//https://developers.google.com/youtube/player_parameters youtube iframe parameters
// https://www.youtube.com/embed/70qN5Pn9Wu0?autoplay=1&amp;mute=0&amp;controls=0&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;iv_load_policy=3&amp;modestbranding=1&amp;enablejsapi=1
//origin=https%3A%2F%2Finsights.gg

//time management, imposter syndrome, youtube api iframes, learning about hooks and creating refs to components in react
//libraries for drawing, react-canvas-draw
//youtube iframe embed link iframe parameters couldn't access from cross origin, then transitioned to youtube iframe api

app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
})

app.get('/drawing', getDrawings, (req, res) => {
    res.status(200).send(res.locals.drawingData);
})

app.post('/drawing', saveDrawings, (req, res) => {
    res.status(200).send(res.locals.successSave);
})

app.delete('/drawing', deleteLastDrawing, (req, res) => {
    res.status(200).send(res.locals.deletedDrawing);
})



//middleware funcs
function getDrawings(req, res, next) {
    drawingModel.find({}, (err, data) => {
        res.locals.drawingData = data;
        next();
    })
}

function saveDrawings(req, res, next) { 
    const newDrawing = new drawingModel({ drawingStored: req.body.drawingStored })
    newDrawing.save((err, data) => {
        res.locals.successSave = data;
        next();
    })
}

function deleteLastDrawing(req, res, next) {

    drawingModel.find({}).sort({ _id: -1 }).limit(1)
        .then(data => {
            drawingModel.deleteOne({ _id: data[0]._id })
                .then(response => {
                    res.locals.deletedDrawing = response;
                    next();
                
                })})
}



app.listen(PORT, () => {
    console.log('listening on port:', PORT, process.env.NODE_ENV);
});