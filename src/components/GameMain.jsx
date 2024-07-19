// src/app/components/Dashboard.jsx
"use client"
import React, { useEffect, useMemo, useState } from 'react';
import mainBackground from '../assets/images/hero-bg.png';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './Footer'
import './user.css'
// import Search from '../../../components/search'
import { GAME, GAMES_LIST } from '../redux/actions';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';

const GameMain = (props) => {
    const router = useNavigate();
    // const state = router.state || {}

    // {
    //     "_id": "66866a9be3c9bc444152e874",
    //     "gameName": "cash_goa",
    //     "startTime": "00:00",
    //     "endTime": "24:00",
    //     "interval": 15,
    //     "icon": "data:image/png;base64,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",
    //     "dates": {
    //         "2024-07-04": {
    //             "00:00": "",
    //             "00:15": "",
    //             "00:30": "",
    //             "00:45": "",
    //             "01:00": "",
                
    //         }
    //     },
    //     "__v": 0
    // }

    const dispatch = useDispatch();

    const games = useSelector(state => state.reducer.games);
    const game = useSelector(state => state.reducer.game); 

    const today = moment().format('YYYY-MM-DD');

    let gameDates = Object.keys(game?.dates || {});
    gameDates = gameDates.filter((date)=> moment(date).isSameOrBefore(today))

    const selectedGameDate = gameDates.includes(today) ? today : gameDates.sort((a, b) => new Date(b) - new Date(a))[0];
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedDate, setSelectedDate] = useState(selectedGameDate);

    useEffect(() => {
        console.log('useEffect game: ' , game)
        setSelectedGame({value:game._id, label: game.gameName});
        setSelectedDate(selectedGameDate)
    },[])

    const details = useMemo(() => {

        return game?.dates?.[selectedDate];
    }, [games, game, selectedDate]) 

    console.log( games?.[game._id], 'detials', games, 'state');

    const entries = details &&  Object.entries(details);
    const columns = [];
    const rowsPerColumn = 12;
  
    for (let i = 0; i < entries?.length; i += rowsPerColumn) {
      columns.push(entries.slice(i, i + rowsPerColumn));
    }

    const handleSearchSelect = () => {
        const updatedGames = [...games];
        const selectedGameObj = games.find(game => game._id === selectedGame.value);
        setSelectedGame({value: selectedGameObj._id, label: selectedGameObj.gameName }|| {});
        setSelectedDate(selectedDate || '');
        dispatch({type: GAMES_LIST, payload: updatedGames})
        dispatch({type: GAME, payload: selectedGameObj});
    };


    const isDateAvailable = date => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return gameDates.includes(formattedDate);
      };
    
      const filterUnavailableDates = date => {
        return isDateAvailable(date);
      };
    
      const handleDateChange = date => {
        let dateselected = moment(date).format('YYYY-MM-DD');
        setSelectedDate(dateselected);
        // Handle any other actions on date change if needed
      };
    
    const handleGameChange = (e) => {
        const value = e.value;
        
        let newGame = games.filter(game => game._id === e.value);

        setSelectedGame({value: newGame[0]._id, label: newGame[0].gameName});
     
        const gameDates = Object.keys(game?.dates || {});
        const selectedGameDate = gameDates.includes(today) ? today : gameDates.sort((a, b) => new Date(b) - new Date(a))[0];
        setSelectedDate(selectedGameDate);
    };

    console.log('game', games, 'state')

    let options = games.map(game => ({ value: game._id , label: game.gameName }));

    const findNearestTimeSlot = (dates) => {
        if(!dates) return { 'nearestTimeSlot': '', 'nearestDate': '' };
        const now = moment();
        const today = now.format("YYYY-MM-DD");
        let nearestTimeSlot = null;
        let nearestDate = null;
    
        if ( dates && dates[today]) {
          const times = Object.keys(dates[today]);
          for (let time of times) {
            const dateTime = moment(`${today} ${time}`, "YYYY-MM-DD HH:mm");
            if (dateTime.isAfter(now)) {
              nearestTimeSlot = time;
              nearestDate = today;
              break;
            }
          }
        }else{

        }
    
        if (!nearestTimeSlot) {
          const sortedDates = Object.keys(dates).sort((a, b) =>
            moment(b).diff(moment(a))
          );
          for (let date of sortedDates) {
            if (moment(date).isBefore(now)) {
              const times = Object.keys(dates[date]).sort((a, b) =>
                moment(b, "HH:mm").diff(moment(a, "HH:mm"))
              );
              nearestTimeSlot = times[0];
              nearestDate = date;
              break;
            }
          }
        }
    
        return { nearestTimeSlot, nearestDate };
      };

                      
    const { nearestTimeSlot, nearestDate } = findNearestTimeSlot(game?.dates);

    if (!nearestTimeSlot || !nearestDate) {
    return null;
    }

    const winnerNumber = game.dates[nearestDate][nearestTimeSlot];
    const now = moment();
 
    const isBeforeOrSame = moment(`${nearestDate} ${nearestTimeSlot}`, 'YYYY-MM-DD HH:mm').isSameOrBefore(now);
    console.log(`${nearestDate} ${nearestTimeSlot}`, '`${nearestDate} ${nearestTimeSlot}`')


    return (
       <div className='min-h-screen text-gray-900 pb-16' style={{background: `url(${mainBackground})`}}>
             <h1 className="font-medium text-3xl capitalize bg-white h-[90px] w-full  flex items-center justify-center">cash craze game</h1>
             <h1 className="font-medium text-3xl capitalize h-[90px] w-full  flex items-center justify-center relative"> 
                <span className='absolute left-[12px] bg-[#000] text-white rounded rounded-[50%] w-[35px] h-[35px] flex items-center justify-center p-2' onClick={() => router(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path strokeLinecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                </span>
                <span> Result History </span>
             </h1> 

            <div className='flex items-center justify-between flex-col md:flex-row gap-4 p-[24px]'>

              <div className="search-container h-[40px] md:h-[60px] bg-white border border-1 border-[#000] w-full flex items-center justify-between gap-4 pl-2 md:p-[5px]">
                <div className='flex items-center justify-center gap-1  md:gap-4'>
                    <span className='text-gray-900 text-[10px] md:text-[24px] flex'> Game :</span>
                    <span className='text-gray-900 text-[0.75em] md:text-[1.5em] capitalize'> {selectedGame && selectedGame.label.split("_").join(" ") || selectedGame.label} </span>
                </div>

                <div className='flex items-center justify-center md:gap-4'>
                    <span className='text-gray-900 text-[10px]  md:text-[14px] md:text-[24px]'> Date :</span>
                    <DatePicker
                        className='border border-0 border-b border-[#000] rounded rounded-sm min-w-[60px]  text-[10px] md:text-[16px]'
                        selected={selectedDate}
                        onChange={handleDateChange}
                        filterDate={filterUnavailableDates}
                    />
                </div>




                <button className='rounded rounded-sm search-button bg-[#193CB2] text-white py-2 px-4' onClick={handleSearchSelect}>Search</button>
                </div>
                <div className="search-container h-[40px] md:h-[60px] bg-white border border-1 border-[#000] w-full flex items-center justify-between   md:max-w-[450px]">
                    <div className='flex items-center justify-center gap-4 px-2 '>
                        <span className='text-gray-900 text-[14px] md:text-[18px]'> Time -</span> <span> {moment(nearestTimeSlot, 'HH:mm').format('hh:mm A')}{} </span>


                    </div>

                    <div className='flex items-center justify-center gap-4'>
                        <span className='text-gray-900  text-[14px] md:text-[18px] '> Number -</span> <span className='bg-[#0E2B55] text-white px-8 py-4 h-[40px] md:h-[60px] flex items-center justiy-center'> {isBeforeOrSame ? winnerNumber : ''} </span>

                    </div>

               </div>
           
            </div>
             <div className=" p-[24px]">

                <div className='flex flex-wrap items-start justify-start  text-white rounded rounded-[8px] text-[15px] '>
                    {columns && columns.map((column, colIndex) => (
                        <div className="column bg-[#193CB2] rounded rounded-[8px] md:rounded md:rounded-[0]  m-4 md:m-0 text-[19px] md:text-[14px] w-full md:w-auto" key={colIndex}>
                            <div className="header">
                                <div className='min-w-[72px]'>Time</div>
                                <div className='text-end'>Number</div>
                            </div>
                            {column.map(([time, value], rowIndex) => { 
                              
                              const isSameDay = moment(selectedDate, 'YYYY-MM-DD').isSame(now, 'day');

                                 const isBeforeOrSame = moment(time, 'HH:mm').isSameOrBefore(now);
                                //  console.log(`${nearestDate} ${nearestTimeSlot}`, '`${nearestDate} ${nearestTimeSlot}`')
                              
                              return(
                                <div className="row" key={rowIndex}>
                                    <div>{moment(time, 'HH:mm').format('hh:mm A')}</div>
                                    {/* <div className='text-end'> {value} </div> */}
                                    <div className='text-end'> {isSameDay && isBeforeOrSame ? value : !isSameDay ? value : ''}  </div>
                                </div>
                            )})}
                        </div>
                    ))}

                    {/* {columns && columns.map((column, colIndex) => (
                        <div className='border border-[1px] px-[24px]'>
                            <table key={colIndex} className="game-details-table">
                                <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Winner</th>
                                </tr>
                                </thead>
                                <tbody>
                                {column.map(([time, value], rowIndex) => (
                                    <tr key={rowIndex}>
                                    <td>{time}</td>
                                    <td>{value}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                    ))} */}

                </div>
             </div>
             <Footer />
        </div>
    );
};

export default GameMain;
