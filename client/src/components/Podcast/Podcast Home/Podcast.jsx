import React, { useState, useEffect, useContext } from "react";
import { getAllSongs,fetchTopPodcards } from '../api';
import PodCard from './PodCard';
import { motion } from "framer-motion";
import PodcastPlayer from "../Podcast Player/PodcastPlayer";
import { SearchContext, ThemeContext } from "../../../App";
import {  SyncLoader } from "react-spinners";
import Animation from "../../../common/Animation";
import InPageNavigation from "../../../common/InPageNavigation";

import TrendingPodcard from "./TrendingPodcard";

import Footer from "../../Home/Footer/Footer";
import { UserContext } from "../../../App";
import { toast } from 'react-hot-toast';

import axios from "axios";

import NoDataMessage from "../../../common/NoDataMessage";

import TrendingPodPlayer from "../Podcast Player/TrendingPodPlayer";


const Podcast = () => {
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [pageState, setPageState] = useState("home");
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false); 
 
  const [trendingPodcards, setTrendingPodcards] = useState(null);
  const { userAuth } = useContext(UserContext);
  const {searchBoxVisibility} = useContext(SearchContext);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const { userAuth: { access_token } } = useContext(UserContext);
  const [isTrendingPodcard, setIsTrendingPodcard] = useState(false);
  useEffect(() => {
    // Fetch all songs
    getAllSongs().then((data) => {
      setAllSongs(data || []);
    });
    // Fetch top podcards  
      fetchTopPodcards().then((data)=>{
        setTrendingPodcards(data);
      });
  
  }, []);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
        setTrendingPodcards([]); // Set trendingPodcards to an empty array after fetching data
    }, 2000);
}, []);

  const handleTrendingPodcardClick = async (podcardData) => {
    if (!userAuth || !userAuth.username) {
      toast.error('Please sign in to listen the podcast!', {style: {
        border:"1px solid #e86f6f",
        fontSize: "17px"
        }});
      return;
    }
    const headers = {
      Authorization: `Bearer ${access_token}`,
  };

    try {
      // Make an HTTP POST request to increment play count
      const response = await axios.post(process.env.REACT_APP_SERVER_DOMAIN+'/api/pod/play-podcast', 
      { podcastId: podcardData._id },
      {
        headers: headers,
      });
      // Log success message or handle response as needed
      console.log('Play count incremented:', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error incrementing play count:', error);
      // Display an error message to the user
      
    }

    const index = trendingPodcards.findIndex(song => song._id === podcardData._id);
    
       //Set the selected song index based on the found index
      setSelectedSongIndex(index);
    
       // Set the selected podcast based on the clicked podcardData
      setSelectedPodcast(podcardData);
      setIsTrendingPodcard(true);
  };
  

  const handleSongClick = async(songIndex) => {
    if (!userAuth || !userAuth.username) {
      toast.error('Please sign in to listen the podcast!', {style: {
        border:"1px solid #e86f6f",
        fontSize: "17px"
      }});
      return;
  }

  const selectedPodcast = filteredSongs[songIndex];
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    // Make an HTTP POST request to increment play count
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_DOMAIN}/api/pod/play-podcast`, 
      { podcastId: selectedPodcast._id }, // Pass the selected podcast's ID
      { headers: headers }
    );

    // Log success message or handle response as needed
    console.log('Play count incremented:', response.data);
  } catch (error) {
    // Handle errors
    console.error('Error incrementing play count:', error);
    // Display an error message to the user
    //toast.error('Failed to increment play count.');
  }
    let songsInCategory = [];
    if (pageState !== "home") {
      songsInCategory = allSongs.filter(song => song.category.toLowerCase() === pageState);
    } else {
      songsInCategory = allSongs;
    }
  
    const selectedSongInCategory = songsInCategory[songIndex];
    const selectedSongIndexInAllSongs = allSongs.indexOf(selectedSongInCategory);
    
    setSelectedSongIndex(selectedSongIndexInAllSongs);
    setIsTrendingPodcard(false);
  };

  const loadPodcastByCategory = async (e) => {
    
    const category = e.target.innerText.toLowerCase();
    const newPageState = pageState === category ? "home" : category;
    setPageState(newPageState);
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await getAllSongs();
      setAllSongs(data ||[]);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  let categories = [
    "Social Media",
    "Health",
    "Education",  
    "Motivation",
    "Crime",
    "Sports",
    "Development",
    "Comedy",
    "History"  
  ];

  // Filter songs based on the selected category
  const filteredSongs = allSongs.filter(song => pageState === "home" || song.category.toLowerCase() === pageState) ||[];

  return (
    <Animation>
      <section className="h-cover md:px-[4vw] flex flex-col justify-center gap-5 bg-cool-white">
            <div className="flex flex-col sm:hidden max-md:hidden">
                <h1 className="font-medium text-xl text-primary mb-8 tracking-wide">
                  Trending <i className="fi fi-rr-arrow-trend-up text-primary"></i>
                </h1>
                <div className="flex justify-around">
                {trendingPodcards ===null ? 
                  <div className="center w-full">
                            <SyncLoader color="#f59a9a" margin={6} />
                    </div>
                : trendingPodcards.length > 0 ? (
          trendingPodcards.map((podcard, index) => (
              <Animation transition={{ duration: 1, delay: index * 0.1 }} key={podcard._id}>
                  <TrendingPodcard data={podcard} index={index} onClick={handleTrendingPodcardClick} />
              </Animation>
          ))
            ) : (
                <div className="center w-full p-5">
                    <NoDataMessage message={"No Trending Podcards Found"} />
                </div>
            )}

                </div>
              </div>
        <div className={`${searchBoxVisibility?"sm:mt-14 duration-500" : "duration-500"}`}>
          <h1 className="font-medium text-primary tracking-wide text-xl mb-8">
            Categories
          </h1>
          <div className="flex gap-3 flex-wrap">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={loadPodcastByCategory}
                className={`tag ${pageState === category.toLowerCase() ? 
                  (theme === "light" ? "bg-primary text-white font-medium" : "bg-primary text-darkBlack font-medium") : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-cool-white">
          <InPageNavigation
            routes={[pageState,"trending podcasts"]}
            defaultHidden={["trending podcasts"]}
          >
            <div className=" ">
              {loading ? (
                <div className="center">
                  <SyncLoader color="#f59a9a" margin={6} />
                </div>
              ) : filteredSongs.length > 0 ? (
                <SongContainer
                  data={filteredSongs}
                  onSongClick={handleSongClick}
                  pageState={pageState}
                />
              ) : (
                <div className="center w-full p-5">
                  <NoDataMessage message={"No Podcasts Published"} />
                </div>
              )}
            </div>
            <div >
                {trendingPodcards === null ? 
                  <div className="center w-full">
                            <SyncLoader color="#f59a9a" margin={6} />
                  </div>
                : !trendingPodcards.length  ? (
          trendingPodcards.map((podcard, index) => (
              <Animation transition={{ duration: 1, delay: index * 0.1 }} key={podcard._id}>
                  <TrendingPodcard data={podcard} index={index} onClick={handleTrendingPodcardClick} />
              </Animation>
          ))
            ) : (
                <div className="center w-full p-5">
                    <NoDataMessage message={"No Trending Podcards Found"} />
                </div>
            )}

                </div>
          </InPageNavigation>
          {selectedSongIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed left-0 right-0 bottom-0 z-50 bg-cardOverlay backdrop-blur-md"
            >
              {
                // Conditionally rendering PodcastPlayer or TrendingPodPlayer based on isTrendingPodcard
                isTrendingPodcard ? (
                  <TrendingPodPlayer
                    selectedSong={trendingPodcards[selectedSongIndex]}
                    songs={trendingPodcards}
                    setSelectedSongIndex={setSelectedSongIndex}
                  />
                ) : (
                  <PodcastPlayer
                    selectedSong={allSongs[selectedSongIndex]}
                    songs={allSongs}
                    setSelectedSongIndex={setSelectedSongIndex}
                    pageState={pageState}
                  />
                )
              }
            </motion.div>
          )}
    
                          
        </div>
      </section>
      <div className="bg-cool-white">
                <Footer />
            </div>
    </Animation>
  );
};

export const SongContainer = ({ data, onSongClick, pageState }) => {
  return (
    <div className="w-full flex gap-8 justify-start items-center flex-wrap ">
      {data.map((song, i) => (
        <PodCard key={song._id} data={song} onClick={() => onSongClick(i)} />
      ))}
    </div>
  );
};


export default Podcast;