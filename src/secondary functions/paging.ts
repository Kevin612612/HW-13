export function paging(pageSize, pageNumber, quantityOfDocs, items) {
    return {
        pagesCount: Math.ceil(+quantityOfDocs / +pageSize),
        page: +pageNumber,
        pageSize: +pageSize,
        totalCount: +quantityOfDocs,
        items: items,
    };
}