// PodcastPlayer.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { IoMdClose } from 'react-icons/io';
import { motion } from 'framer-motion';
import { UserContext } from '../../../App';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const TrendingPodPlayer = ({ selectedSong, songs, setSelectedSongIndex }) => {
  const { userAuth } = useContext(UserContext);
  const [likesCount, setLikesCount] = useState(selectedSong?.activity?.total_likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikedState = async () => {
      try {
        if (userAuth && userAuth.access_token && selectedSong && selectedSong.activity) {
          const response = await axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/api/pod/is-podcast-liked', { _id: selectedSong._id }, {
            headers: {
              Authorization: `Bearer ${userAuth.access_token}`
            }
          });
          setIsLiked(response.data.isLiked);
          setLikesCount(response.data.likesCount);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikedState();
  }, [userAuth, selectedSong]);

  const handleLikeClick = async () => {
    if (!userAuth || !userAuth.access_token) {
      toast.error('Please SignIn to like the podcast!');
      return;
    }

    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      !isLiked ? ++selectedSong.activity.total_likes : --selectedSong.activity.total_likes;
      const response = await axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/api/pod/like-podcast', { _id: selectedSong._id, isLiked: newIsLiked }, {
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`
        }
      });
      setIsLiked(newIsLiked);
      setLikesCount(response.data?.podcast?.activity?.total_likes || 0);
    } catch (error) {
      console.error(error);
    }
  };
 

  const nextTrack = () => {
    if (selectedSong !== null && songs && songs.length > 0) {
        const selectedIndex = songs.findIndex(song => song._id === selectedSong._id);
      const nextIndex = (selectedIndex + 1) % songs.length;
      setSelectedSongIndex(nextIndex);
    }
  };
  
  const previousTrack = () => {
    if (selectedSong !== null && songs && songs.length > 0) {
        const selectedIndex = songs.findIndex(song => song._id === selectedSong._id);
      const previousIndex = (selectedIndex - 1 + songs.length) % songs.length;
      setSelectedSongIndex(previousIndex);
    }
  };
  

  const closeMusicPlayer = () => {
    setSelectedSongIndex(null); 
  };

  return (
    <div className="w-full flex items-center justify-between gap-3 overflow-hidden bg-white">
      <div className="w-full relative flex items-center gap-4 p-4">
        {selectedSong && (
          <>
            <img src={selectedSong.imageURL} alt={selectedSong.name} className=" md:w-40 md:h-20 w-12 h-12 rounded-md object-cover" />
            <div className="flex items-center justify-center md:gap-3 ">
              <div className="flex flex-col md:gap-1">
                <p className="md:text-xl text-sm text-headingColor font-medium">{selectedSong.name}</p>
                <div className='flex md:gap-1 md:mb-3 sm:hidden '>

                    <img src={selectedSong.author.personal_info?.profile_img } className='sm:hidden md:w-6 md:h-6 w-4 h-4 flex-none rounded-full' alt="User Profile" />
                    <Link to={`/user/${selectedSong.author?.personal_info?.username}`} className='md:mx-1 sm:text-sm md:text-base text-black underline'>@{selectedSong.author?.personal_info?.username}</Link>
                </div>
                <div className=" md:hidden flex items-center gap-1 md:-mt-2 md:mx-2">
                    <button onClick={handleLikeClick} className={`md:w-10 md:h-10 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${isLiked ? 'bg-red/20 text-red' : 'bg-grey/80'}`}>
                      <i className={`fi ${isLiked ? 'fi-sr-heart text-red' : 'fi-rr-heart'} mt-1`}></i>  
                    </button>
                    <p className="md:tex-xl sm:text-l text-dark-grey">{likesCount}</p>
                </div>
              </div>             
            </div>            
          </>
        )}
        
        <div className="md:flex-1 sm:flex-auto">
          <AudioPlayer
            src={selectedSong?.songURL}
            autoPlay={true}
            showSkipControls={true}
            onClickNext={nextTrack}
            onClickPrevious={previousTrack}
            className="w-full sm:w-auto" 
          />
        </div>
        <div className="flex items-center gap-1 md:-mt-2 md:mx-2 sm:hidden">
                <button onClick={handleLikeClick} className={`w-10 h-10 rounded-full flex items-center justify-center ${isLiked ? 'bg-red/20 text-red' : 'bg-grey/80'}`}>
                  <i className={`fi ${isLiked ? 'fi-sr-heart text-red' : 'fi-rr-heart'} mt-1`}></i>  
                </button>
                <p className="tex-xl text-dark-grey">{likesCount}</p>
        </div>
        <div className="h-full flex flex-col gap-3 -mt-20">
          <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
            <IoMdClose className="text-textColor hover:text-headingColor text-xl cursor-pointer" />
          </motion.i>
        </div> 
      </div>
    </div>
  );
};

export default TrendingPodPlayer;