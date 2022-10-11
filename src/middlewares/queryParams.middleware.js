
async function checkQueryParams(req, res, next){
    let offset = 0;
    if(req.query.offset){
      offset = req.query.offset
    }
    let order = "id";
    if(req.query.order){
      order = req.query.order;
    }
    let gameName = false;
    if(req.query.name){
      gameName = req.query.name;
    }

    res.locals.order = order;
    res.locals.offset = offset;
    res.locals.gameName = gameName;
    next();
}

export default checkQueryParams