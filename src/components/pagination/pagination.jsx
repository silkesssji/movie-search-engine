import React from 'react';
import pagination from "./pagination.module.scss";
import cn from 'classnames';
import { generatePagination } from '../../lib/generatePagintaion';

export const Pagination = ({
    totalPages,
    page,
    changePage,
}) => {
    if (totalPages !== 0) {
        return (
            <div className={pagination.pagination}>
                <button
                    type='button'
                    disabled={page === 1}
                    className={cn(pagination.button, { [pagination.disabled]: page === 1 })}
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
                        pagination.button, { [pagination.disabled]: page === totalPages }
                    )}
                    onClick={() => changePage(page + 1)}
                >
                    {'>'}
                </button>
            </div>
        )
    } else {
        return null;
    }

}