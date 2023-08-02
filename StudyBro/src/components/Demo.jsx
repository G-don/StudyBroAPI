import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {

  const [inputValue, setInputValue] = useState("");
  
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));

      setArticle((prevArticle) => ({
        ...prevArticle,
        url: "", 
      }));
      setInputValue("");
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopySummary = () => {
    if (article.summary) {
      setCopied("Summary Copied!");
      navigator.clipboard.writeText(article.summary);
      setTimeout(() => setCopied(""), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
      
    }
  };
  
  const handleLinkClick = (item) => {
    setArticle(item);
    setInputValue(""); 
    setArticle((prevArticle) => ({
      ...prevArticle,
      url: "", 
    }));
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
    
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
          
        >
          <img
            src={linkIcon}
            alt='link-icon'
            className='absolute left-0 my-2 ml-3 w-5'
          />

          <input
            type='url'
            placeholder='Paste the article link'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className='url_input peer' 
          />
          <button
            type='submit'
            className='submit_btn peer-focus:border-green-500 peer-focus:text-green-500'
          >
            <p>↵</p>
          </button>
        </form>

        
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto '>
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => handleLinkClick(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi font-medium text-sm truncate '>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-green-100 text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-satoshi font-normal text-green-50'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-400 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
              <button
                  className='copy_btn absolute bottom-3 right-3'
                  onClick={handleCopySummary}
                >
                  <img
                    src={copied === "Summary Copied!" ? tick : copy}
                    alt={copied === "Summary Copied!" ? "tick_icon" : "copy_icon"}
                    className='w-[40%] h-[40%] object-contain'
                  />
                </button>
                <p className='font-inter font-medium text-sm text-green-100'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;