import React from 'react';
import pagination from "./modules/pagination.module.scss";
import cn from 'classnames';

export class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let pages = [];
        for (let i = this.props.page + 1; i <= this.props.page + 5; i++) {
            pages.push
        }
        console.log(pages)
        return(
            <div className={pagination.pagination}>
                {this.props.totalPages != 0 && <button 
                    type='button' 
                    className={cn(pagination.button, this.props.page === 1 ? pagination.current : '')}
                    value={1} 
                    onClick={this.props.changePage}
                >
                    {1}
                </button>}
                <div className={pagination.dots}>...</div>
                <button 
                    type='button' 
                    disabled={this.props.pages[0] === 1} 
                    className={cn(pagination.button, this.props.pages[0]===1 ? pagination.disabled : '')} 
                    value={"back"} onClick={this.props.changePage}
                >
                    {'<'}
                </button>
                {this.props.pages.map((elem, index) => {
                    if (!(elem > this.props.totalPages)) {
                        return <button 
                        type='button' 
                        value={elem}
                        className={cn(pagination.button, this.props.page === this.props.pages[index] ? pagination.current : '')}
                        onClick={this.props.changePage}
                        >
                        {elem}
                        </button>
                    } else {
                        return null
                    }}
                )}
                <button 
                    type='button' 
                    disabled={!(this.props.totalPages > this.props.pages[this.props.pages.length - 1])} 
                    className={cn(
                        pagination.button, !(this.props.totalPages > this.props.pages[this.props.pages.length - 1]) ? pagination.disabled : ''
                    )} 
                    value={"forward"} 
                    onClick={this.props.changePage}
                    >
                    {'>'}
                </button>
                <div className={pagination.dots}>...</div>
                {this.props.totalPages != 0 && <button 
                    type='button' 
                    className={cn(pagination.button, this.props.page === this.props.totalPages ? pagination.current : '')}
                    value={this.props.totalPages} 
                    onClick={this.props.changePage}
                >
                    {this.props.totalPages}
                </button>}
            </div>
        )
    }
}