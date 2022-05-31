import React from 'react';
import filters from './filters.module.scss';
import { Checkbox } from '../checkbox/checkbox';

export const Filters = ({
    adult, onChange
}) => {
    return(
        <div className={filters.container}>
            <Checkbox id='checkboxFilterPanel1'
                label="Adult"
                checked={adult}
                value="adult"
                onChange={onChange}
            />
            {/* <Checkbox id='checkboxFilterPanel2'
                label="Без пересадок"
                checked={this.props.transfers.includes(0)}
                value={0}
                onChange={this.props.onChange}
                onFilter={() => this.props.onFilter(0)}
            />
            <Checkbox id='checkboxFilterPanel3'
                label="1 пересадка"
                checked={this.props.transfers.includes(1)}
                value={1}
                onChange={this.props.onChange}
                onFilter={() => this.props.onFilter(1)}
            />
            <Checkbox id='checkboxFilterPanel4'
                label="2 пересадки"
                checked={this.props.transfers.includes(2)}
                value={2}
                onChange={this.props.onChange}
                onFilter={() => this.props.onFilter(2)}
            />
            <Checkbox id='checkboxFilterPanel5'
                label="3 пересадки"
                checked={this.props.transfers.includes(3)}
                value={3}
                onChange={this.props.onChange}
                onFilter={() => this.props.onFilter(3)}
            /> */}
        </div>
    )
}