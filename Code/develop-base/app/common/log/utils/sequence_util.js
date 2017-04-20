/**
 * Created by Andrew on 2016/3/3.
 */

exports.seqCreate=function seqCreate(req, res, next) {
    var timestamp = (new Date()).valueOf();
    req.locals=req.locals || {};
    req.locals.sequence=timestamp;

    next();

};