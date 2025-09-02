// 2nd Component i.e. "Title"

function Title() {

    return(
        <div className="title">
            <p className=" dark:text-sky-300 max-md:text-6xl md:text-5xl lg:text-7xl opacity-0 [animation:fadein_2s_ease_forwards] [animation-delay:1s]">VisionMeet</p>
       
            {/* Define keyframes inline i.e. tailwind Css Animation Fade property*/} 
           <style>
            {`
              @keyframes fadein {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}
           </style>

        </div>
    )
}
 
export default Title;


