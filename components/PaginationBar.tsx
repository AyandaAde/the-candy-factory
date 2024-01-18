import Link from 'next/link';
import React from 'react'

type Props = {
    currentPage: number;
    totalPages: number;

}

const PaginationBar = ({ currentPage, totalPages }: Props) => {
    const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
    const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

    const numberedPageItems: JSX.Element[] = []

    for (let page = minPage; page <= maxPage; page++) {
        numberedPageItems.push(
            <Link
                href={`?page=${page}`}
                key={page}
                className={`join-item btn ${currentPage === page ? "btn-active pointer-events-none" : ""}`}
            >
                {page}
            </Link>
        )
    }
    return (
        <>
            <div className="join">
                {numberedPageItems}
            </div>
        </>
    )
}

export default PaginationBar