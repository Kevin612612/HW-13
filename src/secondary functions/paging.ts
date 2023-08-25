export function paging(pageParams, finalArray: any[], quantityOfDocs: number) {
    return {
        pagesCount: Math.ceil(quantityOfDocs / pageParams.pageSize),
        page: pageParams.pageNumber,
        pageSize: pageParams.pageSize,
        totalCount: quantityOfDocs,
        items: finalArray.slice((pageParams.pageNumber - 1) * pageParams.pageSize, pageParams.pageNumber * pageParams.pageSize),
    };
}