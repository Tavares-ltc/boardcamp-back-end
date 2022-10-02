
async function checkQueryParams(req, res, next){
    let offset = 0;
    if(req.query.offset){
      offset = req.query.offset
    }
    let order = "id";
    if(req.query.order){
      order = req.query.order;
    }

    res.locals.order = order
    res.locals.offset = offset
    next()
}

export default checkQueryParams