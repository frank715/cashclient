"use client"
import React, { useEffect, useState } from 'react';
import mainBackground from '../assets/images/hero-bg.png';
import { userServices } from '../lib/userServices';
import moment from "moment";
import Footer from './Footer'
import { useDispatch } from 'react-redux';
import { GAME, GAMES_LIST } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

const MainHome = () => {

  console.log('main hone')

    const router = useNavigate();
    const dispatch = useDispatch();

    const loggedIn = typeof window !== 'undefined' && localStorage.getItem('token');

console.log(loggedIn, 'loggein')
    const [gamesList, setGamesList] = useState()

    const fetchGames = async () => {
        try {
            const {data, status} = await userServices.getGamesList();
            if(status){
                setGamesList(data.games);
                dispatch({type: GAMES_LIST, payload: data.games})
                console.log(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
      console.log(loggedIn, 'loggein')
      if(loggedIn){
        router('/dashboard')
      }
        fetchGames();
    },[]);

    const findNearestTimeSlot = (dates) => {
        const now = moment();
        const today = now.format("YYYY-MM-DD");
        let nearestTimeSlot = null;
        let nearestDate = null;
    
        if (dates[today]) {
          const times = Object.keys(dates[today]);
          for (let time of times) {
            const dateTime = moment(`${today} ${time}`, "YYYY-MM-DD HH:mm");
            if (dateTime.isSameOrBefore(now)) {
              nearestTimeSlot = time;
              nearestDate = today;
              // break;
            }
          }
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

      const colors = ["#BF6C0B", "#0962AC", "#06849F", "#0F825B","#3069D7"];

      const getRandomColorClass = (index) => {
        return `text-[${colors[index % colors.length]}]`;
      };

      const getRandomBgClass = (index) => {
        return `bg-[${colors[index % colors.length]}]`;
      };

    const isResultTimeNear = (resultTime) => {
        const now = moment();
        const result = moment(resultTime, "HH:mm A");
        const diff = result.diff(now, "minutes");
        return diff >= 0 && diff <= 30; // Within 30 minutes before the result time
      };

    const handleMainGame = (e, game, index) => {
        router("/user/gamemain");
        dispatch({type:GAME, payload: game})
    }

    const handleLogin = () => {
      router('/login')
    }

    return (
        <div className='min-h-screen text-gray-900 pb-16' style={{background: `url(${mainBackground})`}}>
             <h1 className="font-medium text-3xl capitalize bg-white h-[70px] w-full  flex items-center justify-center relative">
              <span>
                cash craze game
              </span>

        <button onClick={handleLogin} className='bg-white-600 border boder-1 text-gray-700 text-[16px] w-[75px] h-[35px]  absolute  right-2'> Log in </button>
      </h1>
      <div className='flex flex-wrap items-start justify-start pb-[62px]'>
                {gamesList?.map((game, index) =>  {

                     const color = getRandomColorClass(index);
                     const randomBg = getRandomBgClass(index);
                      
                       const { nearestTimeSlot, nearestDate } = findNearestTimeSlot(game?.["dates"]);
            
                      if (!nearestTimeSlot || !nearestDate) {
                        return null;
                      }
            
                      const winnerNumber = game?.["dates"][nearestDate][nearestTimeSlot];
                      // console.log(nearestDate, 'winnerNumber', nearestTimeSlot)
                      const isNear = moment().isSame(nearestDate, 'day') && moment().isBetween(
                        moment(`${nearestDate} ${nearestTimeSlot}`, "YYYY-MM-DD HH:mm").subtract(game?.["interval"], 'minutes'),
                        moment(`${nearestDate} ${nearestTimeSlot}`, "YYYY-MM-DD HH:mm")
                      );

                     
            
                      const formattedGameName = game && typeof game?.["gameName"] === 'string' ?  game?.["gameName"]?.split("_").join(" ") : game?.["gameName"];


                      const now = moment();
                    const currentDay = now.format("YYYY-MM-DD");
                    const isToday = nearestDate === currentDay;
                    const isBeforeOrSame = moment(`${nearestDate} ${nearestTimeSlot}`, 'YYYY-MM-DD HH:mm').isSameOrBefore(now);

                    return(
                    <div className='m-2 flex-1' key={index}  onClick={(e) => handleMainGame(e, game, index)}>
                        

                    <div className="min-w-[170px] md:min-w-[320px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <div className='flex items-center justify-center h-[70px] gap-4'>

                           
                            <img
                                src={game?.["icon"]}
                                className='h[40px] w-[40px]'
                                alt='icon'
                            />
                            <h5 className={`mb-2 text-[16px] md:text-2xl font-semibold tracking-tight   dark:text-white capitalize `}
                             style={{ 
                              color:  game?.color 
                            }}
                            > { formattedGameName}</h5>
                        </div>
                        
                        <div className='flex  flex-col items-center md:items-start justify-start md:ps-4 md:relative'>
                            <p className={`h-[106px] w-[106px] rounded rounded-[50%]  md:absolute md:right-[10px] text-[32px] text-[#fff] flex items-center justify-center p-4`}
                              style={{ 
                                background: isNear ?  "#239C74"  : game?.color 
                              }}
                            >
                                {/* { isBeforeOrSame ? winnerNumber : ''  } */}
                                { winnerNumber }
                            </p>
                            <div className='flex mt-[4px]  items-center flex-col'>
                                <p className="m-0 mr-1 md:mb-2 text-[13px] md:text-[21px] font-semibold tracking-tight text-gray-900 dark:text-white"> { "Result Time"}</p>
                                <div className='flex  items-center flex-row md:flex-col'>

                                <p className="m-0 mr-1  md:mb-2 text-[12px] md:text-[21px] font-semibold tracking-tight text-gray-900 dark:text-white">  {isToday ? 'Today ' : nearestDate} </p>
                                <p className={`m-0 mr-1 md:mb-2 text-[12px] md:text-[21px] font-semibold tracking-tight ${ isNear ? "text-[#239C74]" : "text-gray-900" }  dark:text-white`}> {moment(nearestTimeSlot, 'HH:mm').format('hh:mm A')} </p>
                                </div>
                            </div>

                            
                        </div>
                    </div>

                    </div>
                )})}
             </div>
             <Footer />
        </div>
    );
};

export default MainHome;
