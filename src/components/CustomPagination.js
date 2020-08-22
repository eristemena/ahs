import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const CustomPagination = ({
    activePage = () => {},
    setPage = () => {},
    activeNav = () => {},
    pages,
    currentPage,
}) => {
    const paginationComponent = (number) => (
        <PaginationItem
            className={`goto-page ${
                activePage(number) ? 'disabled active' : ''
            }`}
            key={number}>
            <PaginationLink
                disabled={activePage(number)}
                onClick={() => setPage(number)}>
                {number}
            </PaginationLink>
        </PaginationItem>
    );

    const normalPages = (pages) => {
        if (pages.length > 4) {
            if (currentPage !== 1 && currentPage !== pages.length) {
                return (
                    <Fragment>
                        {pages.map((number) => {
                            if (
                                number >= currentPage - 1 &&
                                number <= currentPage + 1
                            ) {
                                return paginationComponent(number);
                            }
                        })}
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        {pages.map((number) =>
                            currentPage === pages.length
                                ? number > pages.length - 3
                                    ? paginationComponent(number)
                                    : null
                                : number < 4
                                ? paginationComponent(number)
                                : null
                        )}
                    </Fragment>
                );
            }
        } else {
            return (
                <Fragment>
                    {pages.map((number) => paginationComponent(number))}
                </Fragment>
            );
        }
    };
    return (
        <div className="text-center mt-2 custom-pagination">
            <Pagination
                className="d-inline-block"
                size="sm"
                listClassName="justify-content-center">
                <PaginationItem
                    className={`previous-page ${
                        activeNav('prev') ? 'disabled' : ''
                    }`}>
                    <PaginationLink
                        disabled={activeNav('prev')}
                        onClick={() => setPage(1)}>
                        <i className="simple-icon-control-start" />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem
                    className={`previous-page ${
                        activeNav('prev') ? 'disabled' : ''
                    }`}>
                    <PaginationLink
                        disabled={activeNav('prev')}
                        onClick={() => setPage(currentPage - 1)}>
                        <i className="simple-icon-arrow-left" />
                    </PaginationLink>
                </PaginationItem>
                {normalPages(pages)}
                <PaginationItem
                    className={`next-page ${
                        activeNav('next') ? 'disabled' : ''
                    }`}>
                    <PaginationLink
                        disabled={activeNav('next')}
                        onClick={() => setPage(currentPage + 1)}>
                        <i className="simple-icon-arrow-right" />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem
                    className={`next-page ${
                        activeNav('next') ? 'disabled' : ''
                    }`}>
                    <PaginationLink
                        disabled={activeNav('next')}
                        onClick={() => setPage(pages.length)}>
                        <i className="simple-icon-control-end" />
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        </div>
    );
};

CustomPagination.propTypes = {
    activePage: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    activeNav: PropTypes.func.isRequired,
    pages: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
};

export default CustomPagination;
