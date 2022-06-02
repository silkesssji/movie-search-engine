import React from 'react';
import cn from 'classnames';
import style from "./checkbox.module.scss";

export const Checkbox = ({
    id, label, checked, value, onChange
}) => {
    return (
        <label
            className={cn(
                style.checkbox,
                {[style.checkbox_all] : value === 'All'},
                {[style.checkbox_checked] : checked},
            )
        }>
            <input className={style.input} 
                type="checkbox" 
                id={id} 
                checked={checked} 
                onChange={onChange}
                value={value}
            />
            <div className={style.content}/>
            {label}
        </label>
    )
}