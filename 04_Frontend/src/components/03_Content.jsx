// 3rd Component i.e. "Content"


function Content() {

    return(
        <div className="content">
            <p className="text-cyan-100 text-3xl opacity-0 [animation:fadeIn_2s_ease_forwards] [animation-delay:1s]">Connect with your</p>
            <p className="text-cyan-100 text-shadow-amber-100 text-3xl opacity-0 [animation:fadeIn_2s_ease_forwards] [animation-delay:1.5s]">Loved Ones</p>
            <br />
            <p className="text-white font-medium opacity-0 [animation:fadeIn_2s_ease_forwards] [animation-delay:2s]">Face-to-Face, From Anywhere.</p>
        
            {/* Define keyframes inline i.e. tailwind Css Animation Fade property*/} 
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
        </div>
    )
}

export default Content;







