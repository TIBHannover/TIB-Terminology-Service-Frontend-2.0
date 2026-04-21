import React, { useEffect, useMemo, useState } from "react";
import "../../layout/pagination.css";

type PaginationProps = {
  clickHandler: (value: any) => void;
  count: number | string;
  initialPageNumber: number | string;
};

const toInt = (value: number | string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 1 : parsed;
};

const Pagination = (props: PaginationProps) => {
  const [activePageNumber, setActivePageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setActivePageNumber(toInt(props.initialPageNumber));
    setPageCount(toInt(props.count));
  }, [props.initialPageNumber, props.count]);

  const listOfPageNumbersToRender = useMemo(() => {
    const numbersToRender: number[] = [];
    if (pageCount === 1) {
      numbersToRender.push(1);
    } else if (pageCount === 2) {
      numbersToRender.push(1, 2);
    } else if (activePageNumber < pageCount - 1) {
      numbersToRender.push(
        activePageNumber,
        activePageNumber + 1,
        activePageNumber + 2,
      );
    } else if (activePageNumber + 1 === pageCount) {
      numbersToRender.push(
        activePageNumber - 1,
        activePageNumber,
        activePageNumber + 1,
      );
    } else if (activePageNumber === pageCount) {
      numbersToRender.push(
        activePageNumber - 2,
        activePageNumber - 1,
        activePageNumber,
      );
    }
    return numbersToRender;
  }, [activePageNumber, pageCount]);

  const previousButtonClickedValue = () => {
    if (activePageNumber > 1) {
      return activePageNumber - 1;
    }
    return activePageNumber;
  };

  const nextButtonClickedValue = () => {
    if (activePageNumber < toInt(props.count)) {
      return activePageNumber + 1;
    }
    return activePageNumber;
  };

  const middleButtonClickedValue = (element: HTMLLIElement) => {
    const valueAttr = element.getAttribute("data-value");
    const value = valueAttr ? Number(valueAttr) : activePageNumber;
    return Number.isNaN(value) ? activePageNumber : value;
  };

  const paginationClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    const clickedElement = e.target as HTMLElement;
    const clickedLi = clickedElement.closest("li");
    if (!clickedLi) {
      return;
    }

    let newActivePageNumber = activePageNumber;
    if (clickedLi.classList.contains("pagination-end")) {
      newActivePageNumber = nextButtonClickedValue();
    } else if (clickedLi.classList.contains("pagination-start")) {
      newActivePageNumber = previousButtonClickedValue();
    } else {
      newActivePageNumber = middleButtonClickedValue(clickedLi);
    }

    setActivePageNumber(newActivePageNumber);
    props.clickHandler(newActivePageNumber);
  };

  const middleButtonsHtml = listOfPageNumbersToRender.map((number) => (
    <li
      className={
        "pagination-btn pagination-middle-btn " +
        (activePageNumber === number ? "selected-page" : "")
      }
      onClick={paginationClickHandler}
      data-value={number}
      key={number}
    >
      <a className="pagination-link">{number}</a>
    </li>
  ));

  return (
    <ul className="pagination-holder">
      <li
        className="pagination-btn pagination-start"
        onClick={paginationClickHandler}
        key={1}
      >
        <a className="pagination-link pagination-start">Previous</a>
      </li>
      {middleButtonsHtml}
      <li
        className="pagination-btn pagination-end"
        onClick={paginationClickHandler}
        key={2}
      >
        <a className="pagination-link pagination-end">Next</a>
      </li>
    </ul>
  );
};

export default Pagination;
