import {logo} from '../assets';

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
         <nav className='flex justify-between items-center w-full mb-10 pt-3'>
            <img src={logo} alt='logo' className='w-28 object-contain'/>

            <button type='button' onClick={() => window.open('https://github.com/g-don')} className='orange_btn'>
            GitHub
            </button>
         </nav>
         <h1 className='head_text'>
         Study Bro's Summarizer<br className='max-md:hidden'/> <span className='green_gradient'>OpenAI GPT-4</span>
         </h1>
         <h2 className='desc'>
         Simplify your studies with Study Bro's Summarize - an efficient, open-source article summariser that turns long articles into clear and concise summaries. Say goodbye to overwhelming text and hello to fast, effective studying. Get the essential insights you need with Study Bro - your ultimate study companion.
         </h2>
    </header>
  )
}

export default Hero