import React from 'react';
import cn from 'classnames';
import "./checkbox.module.scss";

export const Checkbox = ({
    id, label, checked, value, onChange
}) => {
    return (
        <label
            className={cn("filter-panel__checkbox", {
            'filter-panel__checkbox--checked': checked,
        })}>
            <input className='filter-panel__input' 
                type="checkbox" 
                id={id} 
                checked={checked} 
                onChange={onChange}
                value={value}
            />
            {value !== "adult" &&
                <div className='filter-panel__content'>
                    <button className='filter-panel__only-filter-button' 
                        type='button'
                        onClick={onFilter}>Только
                    </button>
                </div>}
            {label}
        </label>
    )
}