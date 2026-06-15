import React from 'react';
import '../../layout/pagination.css';

type PaginationProps = {
    clickHandler: (value: any) => void;
    count: number | string;
    initialPageNumber: number | string;
};

type PaginationState = {
    activePageNumber: number;
    pageCount: number;
    listOfPageNumbersToRender: number[];
    middleButonsHtml: React.ReactNode;
};

class Pagination extends React.Component<PaginationProps, PaginationState> {
    constructor(props: PaginationProps) {
        super(props);
        this.state = ({
            activePageNumber: 1,
            pageCount: 0,
            listOfPageNumbersToRender: [],
            middleButonsHtml: ""
        });
        this.createMiddleButtons = this.createMiddleButtons.bind(this);
        this.setTheListOfPageNumbersToRender = this.setTheListOfPageNumbersToRender.bind(this);
        this.paginationClickHandler = this.paginationClickHandler.bind(this);
    }


    setTheListOfPageNumbersToRender() {
        let numbersToRender = [];
        let currentPageNumebr = this.state.activePageNumber;
        let totalPageCount = this.state.pageCount;
        if (totalPageCount === 1) {
            numbersToRender.push(1);
        }
        else if (totalPageCount === 2) {
            numbersToRender.push(1);
            numbersToRender.push(2);
        }
        else if (currentPageNumebr < totalPageCount - 1) {
            numbersToRender.push(currentPageNumebr);
            numbersToRender.push(currentPageNumebr + 1);
            numbersToRender.push(currentPageNumebr + 2);
        }
        else if (currentPageNumebr + 1 === totalPageCount) {
            numbersToRender.push(currentPageNumebr - 1);
            numbersToRender.push(currentPageNumebr);
            numbersToRender.push(currentPageNumebr + 1);
        }
        else if (currentPageNumebr === totalPageCount) {
            numbersToRender.push(currentPageNumebr - 2);
            numbersToRender.push(currentPageNumebr - 1);
            numbersToRender.push(currentPageNumebr);
        }
        this.setState({
            listOfPageNumbersToRender: numbersToRender
        }, () => {
            this.createMiddleButtons();
        });
    }


    createMiddleButtons() {
        let result: React.ReactNode[] = [];
        let numbersToRender = this.state.listOfPageNumbersToRender;
        let activeNumber = this.state.activePageNumber;
        for (let number of numbersToRender) {
            result.push(
                <li className={'pagination-btn pagination-middle-btn ' + (activeNumber === number ? "selected-page" : "")}
                    onClick={this.paginationClickHandler}
                    value={number}
                    key={number}
                >
                    <a className='pagination-link'>{number}</a>
                </li>
            );
        }
        this.setState({ middleButonsHtml: result });
    }


    paginationClickHandler(e: React.MouseEvent<HTMLElement>) {
        let activePageNumber = this.state.activePageNumber;
        const target = e.target as HTMLElement;
        if (target.classList.contains('pagination-end')) {
            activePageNumber = this.nextButtonClickedValue();
        }
        else if (target.classList.contains('pagination-start')) {
            activePageNumber = this.previousButtonClickedValue();
        }
        else {
            activePageNumber = this.middleButtonClickedValue(target);
        }
        this.setState({
            activePageNumber: parseInt(String(activePageNumber))
        }, () => {
            this.setTheListOfPageNumbersToRender();
            this.props.clickHandler(activePageNumber);
        });
    }

    previousButtonClickedValue() {
        let activePageNumber = parseInt(String(this.state.activePageNumber));
        if (activePageNumber > 1) {
            return activePageNumber - 1;
        }
        return activePageNumber;
    }


    nextButtonClickedValue() {
        let activePageNumber = parseInt(String(this.state.activePageNumber));
        if (activePageNumber < parseInt(String(this.props.count))) {
            return activePageNumber + 1;
        }
        return activePageNumber;
    }


    middleButtonClickedValue(element: HTMLElement) {
        if (element.nodeName === "LI") {
            return Number((element as HTMLLIElement).value);
        }
        return Number((element.parentNode as HTMLLIElement).value);
    }


    componentDidMount() {
        this.setState({
            activePageNumber: parseInt(String(this.props.initialPageNumber)),
            pageCount: parseInt(String(this.props.count))
        }, () => {
            this.setTheListOfPageNumbersToRender();
        });
    }

    componentDidUpdate() {
        let inCommingPageCount = parseInt(String(this.props.count));
        let currentPageCount = parseInt(String(this.state.pageCount));
        let inCommingPageNumber = parseInt(String(this.props.initialPageNumber));
        let currentPageNumber = parseInt(String(this.state.activePageNumber));
        if (inCommingPageCount !== currentPageCount || inCommingPageNumber !== currentPageNumber) {
            this.setState({
                pageCount: parseInt(String(this.props.count)),
                activePageNumber: parseInt(String(this.props.initialPageNumber))
            }, () => { this.setTheListOfPageNumbersToRender() });
        }
    }


    render() {
        return (
            <ul className='pagination-holder'>
                <li className='pagination-btn pagination-start' onClick={this.paginationClickHandler} key={1}>
                    <a className='pagination-link pagination-start'>Previous</a>
                </li>
                {this.state.middleButonsHtml}
                <li className='pagination-btn pagination-end' onClick={this.paginationClickHandler} key={2}>
                    <a className='pagination-link pagination-end'>Next</a>
                </li>
            </ul>
        );
    }

}

export default Pagination;
