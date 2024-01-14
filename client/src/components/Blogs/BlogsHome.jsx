import React, { useState, useEffect } from "react";
import Animation from "../../common/Animation";
import InPageNavigation from "./InPageNavigation";
import axios from "axios";
import Loader from "../../common/Loader";
import BlogPostCard from "./HomeBlogPostCard"
import TrendingBlogPostCard from "./TrendingBlogPostCard";
import NoBlogsDataMessage from "./NoBlogsDataMessage";
import BlogsNavbar from "./BlogsNavbar";

const BlogsHome = () => {
    let [blogs, setBlog] = useState(null);
    let [trendingBlogs, setTrendingBlog] = useState(null);
    let [pageState,setPageState] = useState("home");

    let categories = [
        "Programming",
        "Social Media",
        "Finances",
        "Cooking",
        "Photography",
        "Technology",
        "Interviews",
    ];

    const fetchLatestBlogs = () => {
        axios
        .get(process.env.REACT_APP_SERVER_DOMAIN+"/latest-blogs")
        .then(({ data }) => {
            setBlog(data.blogs);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    const fetchBlogsByCategory = () => {
        axios
        .post(process.env.REACT_APP_SERVER_DOMAIN+"/search-blogs",{tag:pageState})
        .then(({ data }) => {
            setBlog(data.blogs);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    const fetchTrendingBlogs = () => {
        axios
        .get(process.env.REACT_APP_SERVER_DOMAIN+"/trending-blogs")
        .then(({ data }) => {
            setTrendingBlog(data.blogs);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setBlog(null);
        if(pageState === category){
            setPageState("home");
            return;
        }
        setPageState(category);
    }
    useEffect(() => {

        if(pageState==="home"){
            fetchLatestBlogs();
        }else{
            fetchBlogsByCategory();
        }
        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
    }, [pageState]);

    return (
        <Animation>
        <BlogsNavbar />
        <section className="h-cover flex justify-center gap-10">
            {/* latest blogs */}
            <div className="w-full">
            <InPageNavigation
                routes={[pageState,"trending blogs"]}
                defaultHidden={["trending blogs"]}
            >
                <div>
                {
                    blogs===null ? <Loader /> : 
                    (
                        !blogs.length ? 
                        <NoBlogsDataMessage message={"No Blogs Published"}/>
                        :
                        blogs.map((blog,index)=>{
                            return(
                                <Animation transition={{duration:1,delay:index*0.1}}>
                                    <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                </Animation>
                            )
                        })
                    )
                }
                </div>
                
                <div>
                {
                    trendingBlogs===null ? <Loader /> : 
                    (
                        !trendingBlogs.length ? 
                        <NoBlogsDataMessage message={"No Blogs Published"}/>
                        :
                        trendingBlogs.map((blog,index)=>{
                            return(
                                <Animation transition={{duration:1,delay:index*0.1}}>
                                    <TrendingBlogPostCard blog={blog} index={index}/>
                                </Animation>
                            )
                        })
                    )
                }
                </div>
            
            </InPageNavigation>
            
            </div>
            {/* filters and trending blogs */}
            <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 sm:hidden">
            <div className="flex flex-col gap-10">
                <div>
                    <h1 className="font-medium text-xl mb-8">
                        Stories From All Interests
                    </h1>
                    <div className="flex gap-3 flex-wrap">
                        {categories.map((category, index) => {
                            return (
                                <button onClick={loadBlogByCategory} className={`tag ${pageState===category.toLowerCase() ? "bg-black text-white" : ""}`} key={index}>
                                {category}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h1 className="font-medium text-xl mb-8">
                        Trending <i className="fi fi-rr-arrow-trend-up"></i>
                    </h1>
                    {trendingBlogs === null ? 
                        <Loader />
                        : 
                        (
                            !trendingBlogs.length ? 
                            <NoBlogsDataMessage message={"No Blogs Published"}/>
                            :
                            trendingBlogs.map((blog, index) => {
                            return (
                                <Animation transition={{ duration: 1, delay: index * 0.1 }}>
                                    <TrendingBlogPostCard blog={blog} index={index} />
                                </Animation>
                            );
                            })
                        )
                    }
                </div>
            </div>
            </div>
        </section>
        </Animation>
    );
};

export default BlogsHome;
