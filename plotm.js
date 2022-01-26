import express from "express";
import HoganExpress from "hogan-express";
import bodyParser from "body-parser";
import morgan from 'morgan'
import config from './config/config'
import CookieParser from "cookie-parser"
import router from "./routes/router";
import chalk from "chalk";
import connectToDb from "./config/connect";
import moment from "moment";
connectToDb();
/********************
 * 
 * 
 * Api Configuration
 * 
 * 
 */
const api_app = express();
const api_port = config.api_port;
api_app.use(express.static('api_dist')); //api dist
api_app.engine('html', HoganExpress);
// By default, Express will use a generic HTML wrapper (a layout) to render all your pages. If you don't need that, turn it off.
api_app.set('view options', {
    layout: true
});
api_app.set('layout', 'container');
api_app.set('views', __dirname + '/api_dist');
api_app.set('view engine', 'html');
api_app.use(bodyParser.text({ limit: config.BodyParserLimit }))
api_app.use(bodyParser.raw({ limit: config.BodyParserLimit }));
api_app.use(bodyParser.json({ limit: config.BodyParserLimit }));
api_app.use(bodyParser.urlencoded({ extended: true, limit: config.BodyParserLimit }));
api_app.use(morgan(function (tokens, req, res) {
    let method = tokens.method(req, res);
    let url = tokens.url(req, res);
    let resptime = `${tokens['response-time'](req, res)} ms`;
    let time = moment().utcOffset(330).format(config.Common_Date_Time_Format);
    return ` ${chalk.gray(time)}   ${chalk.bold.greenBright(method)} ${chalk.yellowBright(url)}  ${chalk.yellowBright(resptime)}`;
}))
api_app.use(CookieParser());
api_app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
api_app.use('/', router);
// catch 404 and forward to error handler
api_app.use(function (req, res, next) {
    return res.render('index');
});
api_app.listen(api_port, () => {
    console.log(`Dream House Api Server started on ${api_port}`);
});


/********************
 * 
 * 
 * Admin Configuration
 * 
 * 
 */
const admin_app = express();
const admin_port = config.admin_port;
admin_app.use(express.static('admin_dist')); //admin dist
admin_app.engine('html', HoganExpress);
// By default, Express will use a generic HTML wrapper (a layout) to render all your pages. If you don't need that, turn it off.
admin_app.set('view options', {
    layout: true
});
admin_app.set('layout', 'container');
admin_app.set('views', __dirname + '/admin_dist');
admin_app.set('view engine', 'html');
admin_app.use(bodyParser.text({ limit: config.BodyParserLimit }))
admin_app.use(bodyParser.raw({ limit: config.BodyParserLimit }));
admin_app.use(bodyParser.json({ limit: config.BodyParserLimit }));
admin_app.use(bodyParser.urlencoded({ extended: true, limit: config.BodyParserLimit }));
admin_app.use(morgan(function (tokens, req, res) {
    let method = tokens.method(req, res);
    let url = tokens.url(req, res);
    let resptime = `${tokens['response-time'](req, res)} ms`;
    let time = moment().utcOffset(330).format(config.Common_Date_Time_Format);
    return ` ${chalk.gray(time)}   ${chalk.bold.greenBright(method)} ${chalk.yellowBright(url)}  ${chalk.yellowBright(resptime)}`;
}))
admin_app.use(CookieParser());
admin_app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
admin_app.use('/', router);
// catch 404 and forward to error handler
admin_app.use(function (req, res, next) {
    return res.render('index');
});
admin_app.listen(admin_port, () => {
    console.log(`Dream House Admin Server started on ${admin_port}`);
});