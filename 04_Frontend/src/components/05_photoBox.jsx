

function PhotoBox(props) {

      let imgLink = props.imgLink;
      let Animatedirec = props.moveDirection;
      let AnimatedMoveLen = props.moveLen;

      return(
         <div className="photo md:h-50 md:w-65 lg:h-55 lg:w-70 bg-pink-600 rounded-xl opacity-0 [animation:fadein_2s_ease_forwards] [animation-delay:1s]">
             <img src={imgLink} className="min-h-full rounded-2xl"></img>
         
            {/* Define keyframes inline i.e. tailwind Css Animation Fade property*/} 
           <style>
            {`
              @keyframes fadein {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}
           </style>
         </div>
      )
}

export default PhotoBox;


