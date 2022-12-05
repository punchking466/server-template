const pagingServer = async (curPage, pageSize, orderCol, orderVal, filterCol, filterVal) => {
    const DEFAULT_START_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;
    const DEFAULT_ORDER_COLUMN = 'createdAt';
    const DEFAULT_ORDER_VALUE = 'desc';

    if (!curPage || curPage <=0){
        curPage = DEFAULT_START_PAGE;
    }

    if (!pageSize || pageSize <=0){
        pageSize = DEFAULT_PAGE_SIZE;
    }

    if (!orderCol){
        orderCol = DEFAULT_ORDER_COLUMN;
    }

    if (!orderVal){
        orderVal = DEFAULT_ORDER_VALUE;
    }

    let result = {
        raw: true,
        where: {},
        offset : (curPage -1) *Number(pageSize),
        limit : Number(pageSize),
        order : [[orderCol,orderVal]]
    }

    if(filterCol){
        result.where = {[filterCol]: filterVal}
    };

    return result;
}

module.exports = {pagingServer};