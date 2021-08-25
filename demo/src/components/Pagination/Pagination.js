import React from "react";

import Container from "react-bootstrap/Container";
import BSPagination from "react-bootstrap/Pagination";

import "./Pagination.scss";

const Pagination = ({ page, setPage, size }) => {
  const minPage = Math.max(0, page - 3);
  const maxPage = Math.min(page + 2, size);

  return (
    <Container className="d-flex justify-content-center mt-4">
      <BSPagination size="sm" className="mb-0">
        <BSPagination.Prev
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          Previous
        </BSPagination.Prev>

        {minPage !== 0 && (
          <>
            <BSPagination.Item onClick={() => setPage(1)}>1</BSPagination.Item>
            {minPage > 1 && <BSPagination.Ellipsis />}
          </>
        )}

        {Array.from({
          length: size,
        })
          .slice(minPage, maxPage)
          .map((_, index) => (
            <BSPagination.Item
              key={index + minPage + 1}
              active={index + minPage + 1 === page}
              onClick={() => setPage(index + minPage + 1)}
            >
              {index + minPage + 1}
            </BSPagination.Item>
          ))}

        {maxPage !== size && (
          <>
            {maxPage < size - 1 && <BSPagination.Ellipsis />}
            <BSPagination.Item onClick={() => setPage(size)}>
              {size}
            </BSPagination.Item>
          </>
        )}

        <BSPagination.Next
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === size}
        >
          Next
        </BSPagination.Next>
      </BSPagination>
    </Container>
  );
};

export default Pagination;
