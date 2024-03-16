import React,{useContext, useState} from 'react'
import MVGRVideo from "../../../assets/videos/MVGR.mp4";
import Navbar from '../Navbar/Navbar';
import Faq from './FAQ';
import { Fade, Zoom } from 'react-awesome-reveal';
import MiddleSection from './MiddleSection';
import Content from './Content';
import { ThemeContext } from '../../../App';


const Body = () => {
    let {theme,setTheme} = useContext(ThemeContext);
    const [list]=useState([
        {
            question:'How Can I upload the Audio?',
            answer:'you can go to the podcast section,and click on upload and provide mentioned details of the Audio.',
            active:1
        },
        {
            question:'How Can I write the blogs?',
            answer:'You have the option write in the blogs section to write the blogs.'
        },
        {
            question:'How will my Audio or Blog get published?',
            answer:'Your Audio or Blog will be reviewed by the Admin and then gets published.'
        },
        {
            question:'How Can I know if any podcast or blog published?',
            answer:'You will get a mail to ur registered Email ID whenever a blog or podcast is published on this website.'
        }
    ]);
    return (
        <div>
           <div>
                <video autoPlay loop muted className="w-full max-h-screen object-cover">
                    <source src={MVGRVideo} type="video/mp4"/>
                </video>
                <div className={`absolute inset-0 ${theme === "light" ? "bg-black" : "bg-white"} bg-opacity-80 opacity-80 `}>
                    <Navbar />
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${theme === "light" ? "text-white" : "text-black"} font-extrabold mt-8 md:mt-20 lg:mt-24 xl:mt-28 tracking-wide text-center`}>
                    Welcome to <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold ml-2 md:ml-6 text-primary"> MVGR VOICES</span>
                    </h1>
                    <p className={`text-base md:text-lg lg:text-xl xl:text-xl ${theme === "light" ? "text-white" : "text-black"} font-semibold mt-5 md:mt-8 lg:mt-10 xl:mt-12 tracking-widest text-center uppercase`}>
                    It's the best platform for Students to share their cool stories in podcasts and blogs.
                    </p>

                </div>
            </div>
            <div className={`${theme==="light" ? "bg-black" : "bg-white"}`}>
                {Content.map((Content,index) =>(
                    <MiddleSection 
                        index={index}
                        title={Content.title}
                        description={Content.description}
                        img={Content.img}
                    />  
                ))}
            </div>                
            <div className={`${theme==="light" ? "bg-black" : "bg-white"} pt-20 flex items-center justify-center`}> 
            <Fade direction='down' delay={0.2}>                    
                <h1 className="text-6xl font-merriweather font-semibold leading-normal text-primary">FAQ's</h1> 
            </Fade>
            </div>                   
            <div className={`${theme==="light" ? "bg-black" : "bg-white"} flex p-20 pt-8 items-center justify-center`}>
                <Zoom>
                <div className="list">
                {
                    list.map((item, key) => (
                        <Faq key={key} datas={item}/>
                    ))                             
                }
                </div>                                    
                </Zoom>
            </div> 
            </div>
    )
}

export default Body;