'use client'
import React, { useState, useEffect, useMemo } from 'react'
// import mainBackground from '../public/assets/images/hero-bg.png';
import mainBackground from '../assets/images/hero-bg.png';
import './dash.css';
import { userServices } from '../lib/userServices';
import { GAME, GAMES_LIST } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const router = useNavigate();  
  const dispatch = useDispatch();

  const [gamesList, setGamesList] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const games = useSelector(state => state.reducer.games);
  const game = useSelector(state => state.reducer.game); 
  const [gameState, setGameState] = useState(game);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const columnsPerPage = 4; // Number of columns

 
  const [selectedGame, setSelectedGame] = useState({});
  const defGame = {label: gameState?.gameName, value: gameState?._id}
  const [selectedDate, setSelectedDate] = useState('');
  const [beforeDay, setBeforeDay] = useState(false);

  const fetchGames = async () => {
    try {
      
        const {data, status} = await userServices.getGamesList();
        if(status){
            setGamesList(data.games);
            dispatch({type: GAMES_LIST, payload: data.games})
            dispatch({type:GAME, payload: data.games?.[0]})
        }
    } catch (error) {
        console.error(error)
    }
}

useEffect(() => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('token');
    if(!token){

        router('/login')
    }
}
    fetchGames();
},[]);


const today = moment().format('YYYY-MM-DD');

const gameDates = Object.keys(gameState?.dates || {});

// const selectedGameDate = gameDates.includes(today) ? today : gameDates.sort((a, b) => new Date(b) - new Date(a))[0];
const selectedGameDate = today;

useEffect(() => {
    setSelectedGame({value:games?.[0]?._id, label: games?.[0]?.gameName});
    setSelectedDate(selectedGameDate);
    setGameState(game);
},[games])

  useEffect(() => {
      if(gameDates.includes(selectedDate)){
        //   console.log(gameDates, 'selectedDate--------------')
          return;
    }else{
        // console.log(gameDates, 'selectedDate++++++++++++++++++++++++++++')
      let updatedGames = [...games];
      let gameIndexObj = updatedGames.map((item, index) => ({item, index})).filter(({item}) => item?._id === gameState?._id);
      console.log(gameState, 'gameIndexObj++++++++++++++++++++++++++++')
      if (gameIndexObj.length ===  0) return;
      let gameIndex = gameIndexObj[0].index;

      const { startTime, endTime, interval} = gameState;

      const today = moment(selectedDate).format('YYYY-MM-DD');
      // console.log(today, 'selectedDate++++++++++++++++++++++++++++')
      // Initialize an empty object for today's intervals
      const todayIntervals = {};

      // Generate the intervals for today's date
      let currentTime = moment(startTime, 'HH:mm');
      const endTimeMoment = moment(endTime, 'HH:mm');
      if (interval === 0) {
        todayIntervals[currentTime.format('HH:mm')] = "";
    }else{
      while (currentTime <= endTimeMoment) {
          todayIntervals[currentTime.format('HH:mm')] = "";
          currentTime = currentTime.add(interval, 'minutes');
      }
    }

      const updatedDates = {[today]: todayIntervals };
       updatedGames[gameIndex] = {...gameState, dates: {...gameState.dates, ...updatedDates}};
       setGameState(updatedGames[gameIndex])
  
      // Add today's date with the generated time slots to the dates object
      // console.log(updatedGames, 'updatedGamesData')
      // dispatch({type:GAMES_LIST, payload: updatedGames});
      dispatch({type:GAME, payload: updatedGames[gameIndex]});
    }
  },[ game,selectedGame, selectedDate])


  const [columns, setColumns] = useState([]);

  useEffect(() => {

    const details =  gameState?.dates?.[selectedDate];
  
    console.log( details, 'detials', games, 'date', selectedGameDate);
  
    const entries = details &&  Object.entries(details);
    const rowsPerColumn = 12;
  
    let updateColumns = []
    for (let i = 0; i < entries?.length; i += rowsPerColumn) {
      updateColumns.push(entries.slice(i, i + rowsPerColumn));
    }

    setColumns(updateColumns)

  }, [game,selectedDate, selectedGame])





  const isDateAvailable = date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      return gameDates.includes(formattedDate);
    };
  
    const filterUnavailableDates = date => {
      return isDateAvailable(date);
    };
  
    const handleDateChange = date => {
      let dateselected = moment(date).format('YYYY-MM-DD');
      let beforeday = moment(date).isBefore(moment(), 'day');

      // console.log(date, beforeday, 'beforeday')
      setBeforeDay(beforeday)
      setSelectedDate(dateselected);
      // Handle any other actions on date change if needed
    };
  
  const handleGameChange = (e) => {
      const value = e.value;
      // console.log(value, 'value');
      let newGame = games.filter(game => game._id === e.value)
      setSelectedGame({value: newGame[0]._id, label: newGame[0].gameName});
      // console.log(newGame, 'newGame')
      const gameDates = Object.keys(game?.dates || {});
      const selectedGameDate = today;
      setSelectedDate(selectedGameDate);
      setGameState(...newGame);
      setBeforeDay(false)
      // dispatch({type: GAME, payload: newGame})
  };

  const handleSearchSelect = () => {
    console.log(selectedGame, 'selectedGameObj')
    const selectedGameObj = games.find(game => game._id === selectedGame.value);
    setSelectedGame({value: selectedGameObj._id, label: selectedGameObj.gameName }|| {});
    setSelectedDate(selectedDate || '');
    setGameState(selectedGameObj)
    
    // dispatch({type: GAME, payload: selectedGameObj});
};

  let options = games?.map(game => ({ value: game._id , label: game.gameName }));

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
  
  }

  const handleTabClick = (e, tab) => {
    setActiveTab(tab)
  }

  const handleChangeBulkUpdate = (e) => {

    const {name, value} = e.target;

    setGameState(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [selectedDate]: {
          ...prev.dates?.[selectedDate],
          [name]: value
        }
      }
    }))
  }

  const handleSaveBulkUpdate = async() => {
    try {

      let gameToUpdate = {_id:gameState?._id, dates: gameState.dates, selectedDate: selectedDate};
      

        const res = await userServices.bulkGameUpdate(gameToUpdate);
        if(res.status){
            toast.success('updated sucessfully');

        }else{
            toast.error('some error occurred')
        }
        
    } catch (error) {
        toast.error("some error occurred");
        console.error("some error --", error)
    }
  }


  const handleSaveViewUpdate = async() => {
    try {

        const res = await userServices.viewGameUpdate(gameState);
        if(res.status){
            toast.success('updated sucessfully');

        }else{
            toast.error('some error occurred')
        }
        
    } catch (error) {
        toast.error("some error occurred");
        console.error("some error --", error)
    }
  }

  // console.log(gameState.dates, 'eelectedgame')

  //react-select styles 
  const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white', border: 0, borderBottom: ' 1px solid #333', borderRadius: 0,  '&:hover': {
      borderBottom: '2px solid #333', // Border color on hover
    }, }),    
  };

  return (
    <div className='min-h-screen text-gray-900' style={{background: `url(${mainBackground})`}}>
      <h1 className="font-medium text-3xl capitalize bg-white h-[90px] w-full  flex items-center justify-center relative">
        <span>
          cash craze game
          </span>

        <button className='bg-red-600 border boder-1 text-white text-[16px] w-[75px] h-[35px]  absolute  right-2'
          onClick={handleLogout}
        > Log out </button>
      </h1>

      <div className="p-2 min-h-full">
        <div className='bg-white rounded rounded-[9px] min-h-full'>
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700  p-[14px] pb-0">
              <ul className="flex flex-wrap -mb-px dash-tabs">
                  <li className="me-2" onClick={(e) => handleTabClick(e, 1)}>
                      <span className={`inline-block p-4 border-b-2  cursor-pointer rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 font-medium text-[20px] ${activeTab === 1 ? 'active text-blue-600 border-b-2 border-blue-600' : ''}`}> Update Data</span>
                  </li>
                  <li className="me-2"  onClick={(e) => handleTabClick(e, 2)}>
                      <span className={`inline-block p-4   cursor-pointer   rounded-t-lg dark:text-blue-500 dark:border-blue-500 font-medium  text-[20px]  ${activeTab === 2 ? 'active text-blue-600 border-b-2 border-blue-600' : ''}`}  > View Data</span>
                  </li>
                
              </ul>
          </div>
          <div>
          <div className='flex items-center justify-center gap-4  p-[14px]'>

            <div className="search-container h-[60px] bg-white border border-0 border-[#000] w-full flex items-center justify-start gap-4">
            <div className='flex items-center justify-center gap-4'>
            <span> Game :</span>

            <Select className={"min-w-[150px] border-0 "}
                options={options} 
                // defaultValue={defGame} 
                value={ selectedGame} 
                 onChange={(e) => handleGameChange(e)}
                styles={colourStyles}
                />
            </div>
                <div className='flex items-center justify-center gap-4'>
                    <span> Date :</span>  
                    <DatePicker
                        className='border border-0 border-b border-[#000] rounded rounded-sm'
                        selected={selectedDate ? moment(selectedDate).toDate() : null}
                        onChange={handleDateChange}
                        minDate={activeTab === 1 ? today : null}
                      //  dateFormat="yyyy-MM-dd"

                        filterDate={activeTab ===2 ? filterUnavailableDates : null}
                    />
                </div>
            <button className='rounded rounded-sm search-button bg-[#193CB2] text-white py-2 px-4' onClick={handleSearchSelect}>Search</button>
            </div>
            </div>
          </div>
          <div className=" p-[14px] pt-0">

           {activeTab === 1 && <div className='flex flex-wrap items-start justify-start  text-white rounded rounded-[8px] text-[14px]'>
                {columns &&  columns
                .slice((currentPage - 1) * columnsPerPage, currentPage * columnsPerPage)
                .map((column, colIndex) => (
                    <div className="column min-h-[380px] bg-[#193CB2] py-2" key={colIndex}>
                        <div className="header">
                            <div className='max-w-[80px]'>Time</div>
                            <div>Number</div>
                        </div>
                        {column.map(([time, value], rowIndex) =>{
                            // console.log(`${JSON.stringify(gameState?.dates?.[selectedDate]?.[time])}`, 'gameState?.dates?.selectedDate?.[time]')
                          return(
                            <div className="row" key={rowIndex}>
                                <div className='h-[20px]'>{moment(time, 'HH:mm').format('hh:mm A')}</div>
                                <input type="text" className='bg-transparent border-0  border-b border-[#fff] h-[20px] max-w-[120px]' name={`${time}`} onChange={(e) => handleChangeBulkUpdate(e)} value={gameState?.dates?.[selectedDate]?.[time] || ''} />
                            </div>
                        )})}
                    </div>
                ))}
            </div>}

           {activeTab === 2 && <div className='flex flex-wrap items-start justify-start  text-white rounded rounded-[8px]  text-[14px]'>
                {columns && columns
                .slice((currentPage - 1) * columnsPerPage, currentPage * columnsPerPage)
                .map((column, colIndex) => (
                        <div className="column  min-h-[380px] bg-[#193CB2] py-2" key={colIndex}>
                            <div className="header">
                                <div className='max-w-[80px]'>Time</div>
                                <div>Number</div>
                            </div>
                            {column.map(([time, value], rowIndex) =>{
                                const isBeforeNow = moment(time, 'HH:mm').isBefore(moment());
                                // console.log(isBeforeNow, `${JSON.stringify(gameState?.dates?.[selectedDate]?.[time])}`, 'gameState?.dates?.selectedDate?.[time]');
                                // console.log(isBeforeNow, 'isBeforeNow')
                            return(
                                <div className=" row relative  " key={rowIndex}>
                                    <div>{moment(time, 'HH:mm').format('hh:mm A')}</div>
                                    {!isBeforeNow && !beforeDay && <span className="absolute left-[45%] top-[5px] bg-[#ff2247] p-1 rounded rounded-[50%] flex items-center justify-center h-[17px] w-[17px]">

                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='#fff' height={'12px'}>
                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/>
                                    </svg>

                                    </span> }
                                    {
                                      !isBeforeNow && !beforeDay ? 
                                      <input type="text" className='bg-transparent border-0  border-b border-[#fff] max-w-[120px] h-[20px] text-end' name={`${time}`} onChange={(e) => handleChangeBulkUpdate(e)} value={gameState?.dates?.[selectedDate]?.[time] || ''}
                                      /> : 
                                      <div className=' h-[20px] w-[120px] text-end'> {gameState?.dates?.[selectedDate]?.[time] || ''} </div>
                                    }
                                      
                                </div>
                            )})}
                        </div>
                    ))}
            </div>}
            {/* Pagination Controls */}
           {Math.ceil(columns.length / columnsPerPage) > 1 && <div className="p-[12px] flex items-center justify-center gap-4 border-0">
              <button
                className=" text-[#000] cursor-pointer  hover:bg-gray-100   w-[20px] h-[20px]  rounded rounded-[50%] font-medium flex items-center justify-center"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
            </svg>

              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(columns.length / columnsPerPage) }, (_, index) => (
                  <button
                    key={index}
                    className={`bg-blue-500 text-white text-[16px] w-[20px] h-[20px] rounded rounded-[50%] font-bold flex items-center justify-center ${
                      currentPage === index + 1 ? 'bg-green-700' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                  <span>  {index + 1} </span>
                  </button>
                ))}
              </div>
              <button
                className="text-[#000] cursor-pointer hover:bg-gray-100   w-[20px] h-[20px]  rounded rounded-[50%] font-medium flex items-center justify-center"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(columns.length / columnsPerPage)}
              >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>


              </button>
            </div>}

          </div>
         {activeTab === 1 && <div className="p-[8px] flex items-center justify-end gap-4 border border-0">
            <button className='bg-green-500 text-white text-[20px] w-[100px] h-[40px] rounded rounded-[6px] font-medium'
                onClick={handleSaveBulkUpdate}
            >save</button>
            <button className='border border-2 border-red-500 text-red-500 text-[20px] w-[100px] h-[40px] rounded rounded-[6px] font-medium' >Cancel</button>
          </div>
          }
         {activeTab === 2 && !beforeDay && <div className="p-[8px] flex items-center justify-end gap-4 border border-0">
            <button className='bg-[#670EAD] text-white text-[20px] w-[100px] h-[40px] rounded rounded-[6px] font-medium'
                onClick={handleSaveViewUpdate}
            > update </button>
            <button className='border border-2 border-red-500 text-red-500 text-[20px] w-[100px] h-[40px] rounded rounded-[6px] font-medium' >Cancel</button>
          </div>
          }

        </div>
      </div>
    </div>
  )
}

export default Dashboard
