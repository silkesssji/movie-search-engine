import React from 'react';
import pagination from "./modules/pagination.module.scss";
import cn from 'classnames';

const range = (from, to) => {
    if (to >= from) {
        return Array.from({ length: to - from + 1 }).map((_, index) => index + from);
    }
    return Array.from({ length: from - to + 1 }).map((_, index) => from - index);
};

const generatePagination = (currentPage, totalPages, maxItems) => {
    if (totalPages < 1 || maxItems < 6) {
        return [];
    }
    if (totalPages <= maxItems) {
        return range(1, totalPages)
            .map((index) => ({ type: 'page', value: index }));
    }

    const lastIndex = maxItems - 1;
    const endDelimiterIndex = lastIndex - 1;
    const middle = Math.floor(maxItems / 2);
    if (currentPage <= middle + 1) {
        const pagination = range(1, maxItems).map(index => ({ type: 'page', value: index }))
        pagination[endDelimiterIndex] = ({ type: 'delimeter' });
        pagination[lastIndex].value = totalPages;
        return pagination;
    }

    const isMaxItemsEven = maxItems % 2 === 0;
    let offset = isMaxItemsEven ? -1 : 0;
    if (currentPage + middle > totalPages) {
        offset += currentPage + middle - totalPages;
    }
    const pagination = range(currentPage - middle - offset, Math.min(currentPage + middle, totalPages))
        .map(index => ({ type: 'page', value: index }));
    pagination[0] = ({ type: 'page', value: 1 });
    pagination[1] = ({ type: 'delimeter' });
    pagination[lastIndex].value = totalPages;
    if (pagination[endDelimiterIndex].value !== totalPages - 1) {
        pagination[endDelimiterIndex] = ({ type: 'delimeter' });
    }
    return pagination;
};

export const Pagination = ({
    totalPages,
    page,
    changePage,
}) => {
    return(
        <div className={pagination.pagination}>
            <button 
                type='button' 
                disabled={page === 1} 
                className={cn(pagination.button, {[pagination.disabled]: page === 1})}
                onClick={() => changePage(page - 1)}
            >
                {'<'}
            </button>
            {generatePagination(page, totalPages, 9)
                .map((elem, index) => elem.type === "page" ? (
                    <button
                        key={index}
                        type="buton"
                        value={elem.value}
                        className={cn(pagination.button, {
                            [pagination.current]: elem.value === page
                        })}
                        onClick={() => changePage(elem.value)}
                    >
                        {elem.value}
                    </button>
                ) : (
                    <div key={index} className={pagination.dots}>...</div>
                )
            )}
            <button 
                type='button' 
                disabled={totalPages === page} 
                className={cn(
                    pagination.button, {[pagination.disabled]: page === totalPages}
                )}
                onClick={() => changePage(page + 1)}
            >   
                {'>'}
            </button>      
        </div>
    )
}