// src/app/components/Search.jsx
'use client'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Calendar from './Calendar'

const Search = ({ onSelect , availableDates }) => {
    const games = useSelector(state => state.reducer.games);

  


    const handleSearch = () => {
        onSelect(selectedGame, selectedDate);
    };

    return (
        <></>
    );
};

export default Search;
