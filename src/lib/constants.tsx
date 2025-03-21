export const albums = [
    {
        name: "paradox",
        spotify: "https://open.spotify.com/album/5bTAQ3akvkB2lW3rfxBopT?si=7dBP18xjSv-7r0asYBILOQ",
        youtube: "https://www.youtube.com/playlist?list=OLAK5uy_nczXlucHTLwT72HK2hN238ENKCrZXJTdc",
        tidal: "https://tidal.com/browse/album/386775581",
        apple: "https://music.apple.com/us/album/the-paradox-of-the-second-choice-deluxe/1768139236"
    },
    {
        name: "wiwwy",
        spotify: "https://open.spotify.com/album/5rSiR7uc2YGstmKdKbW9Fg?si=RMKTUPo9SNGzW4n33P7h5Q",
        youtube: "https://www.youtube.com/playlist?list=OLAK5uy_lAhJ2p1WELy2lmA8DiL2TRD-_4G9o6ysQ",
        tidal: "https://tidal.com/browse/album/215368892",
        apple: "https://music.apple.com/us/album/when-i-was-with-you/1608619799"
    },
    {
        name: "ily",
        spotify: "https://open.spotify.com/album/3z1mhGTHvcCKbglmGsCS4y?si=4ERRcblxQ4esOFHP9qQUBg",
        youtube: "https://www.youtube.com/playlist?list=OLAK5uy_nVdJzRkjef7FkacoKtCoGIcxHiKF_pV0c",
        tidal: "https://tidal.com/browse/album/153254293",
        apple: "https://music.apple.com/us/album/i-love-you/1529298984"
    },
    {
        name: "submerge",
        spotify: "https://open.spotify.com/album/1CUuBUuXB419lgZpzOrndY?si=JCMTxhDISIes67VHEhUhDw",
        youtube: "https://www.youtube.com/playlist?list=OLAK5uy_mELKkGW2oziFS1t5uxfYU6Yk-3LzjR7tk",
        tidal: "https://tidal.com/browse/album/130036543",
        apple: "https://music.apple.com/us/album/submerge/1497542566"
    }
]

export const videos = [
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/iwannafeel.mp4", name: "Screen1" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/wheredougoshort.mp4", name: "Screen2" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/sweeter.mp4", name: "Screen3" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/star.mp4", name: "Screen4" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/lovebomb.mp4", name: "Screen5" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/bitter.mp4", name: "Screen6" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/sour.mp4", name: "Screen7" },
    { src: "https://teck.s3.us-east-1.amazonaws.com/portfolio/live.mp4", name: "Screen8" }
  ];
  

export const quizQuestions = [
    {
      id: 1,
      question: "You wake up on the side of an unfamiliar road. You notice a figure in the distance, watching you. What do you do?",
      options: [
        { text: "A. Ask the figure for help", next: 2 },
        { text: "B. Run the opposite way.", next: 3 },
      ],
    },
    {
      id: 2,
      question: "The figure is a 90 year old woman. She opens her mouth to speak but her dentures fall out of her mouth onto the floor. Do you–",
      options: [
        { text: "A. Pick her teeth up and hand them to her.", next: 4 },
        { text: "B. Groan in disgust and keep walking past her.", next: 5 },
      ],
    },
    {
      id: 3,
      question: "As you run away from the figure, you trip and fall into a 5 foot hole. You spot a shovel and a ladder. Do you–",
      options: [
        { text: "A. Use the shovel to keep digging. Someone was digging this hole for the reason.", next: 6 },
        { text: "B. Climb the hell up out of here. Nothing good ever came from a 5 foot hole in the ground.", next: 7 },
      ],
    },
    {
      id: 4,
      question: "The moment your hand touches the dentures you are zapped into another room. You look around and notice you are in a room full of mirrors. Do you–",
      options: [
        { text: "A. Check yourself out. Only so many chances to see yourself from this many angles.", next: 8 },
        { text: "B. Use your fists to try and shatter as many mirrors as possible. There must be a way out.", next: 9 },
      ],
    },
    {
      id: 5,
      question: "The old lady now has a gun. You feel it pressed to the back of your head. Do you–",
      options: [
        { text: "A. Apologize profusely and blame your lack of courtesy on your crippling fear of teeth.", next: 10 },
        { text: "B. Use your karate skills to disarm her and kick her in the groin.", next: 11 },
      ],
    },
    {
      id: 6,
      question: "You shovel until you hit what appears to be a trapdoor. You climb through and see a hallway with two doors.",
      options: [
        { text: "A. Go through Door 1.", next: 12 },
        { text: "B. Go through Door 2.", next: 13 },
      ],
    },
    {
      id: 7,
      question: "As you climb up you see a hand reaching out as if to help you out of the hole. Do you–",
      options: [
        { text: "A. Grab the hand.", next: 14 },
        { text: "B. Ignore the hand, you don't need the help.", next: 15 },
      ],
    },
    {
      id: 8,
      question: "The mirrors appreciate your vanity. The lights in the room begin to flash a variety of colors and 'Pump Up The Jam' by Technotronic begins playing. Do you–",
      options: [
        { text: "A. Break out into your favorite dance move, 'The Sprinkler.'", next: 16 },
        { text: "B. Look for a way to shut off the music.", next: 17 },
      ],
    },
    {
      id: 9,
      question: "You shatter four mirrors until one of them breaks completely, revealing another room with a single computer on the ground and a door. Do you-",
      options: [
        { text: "A. Investigate what's on the computer.", next: 18 },
        { text: "B. Keep exploring, this room doesn't seem to have what you need.", next: 19 },
      ],
    },
    {
      id: 10,
      question: "The old lady puts the gun down and shakes her head disapprovingly while walking away. Do you–",
      options: [
        { text: "A. Keep following the old lady. No way she'll try to shoot you again, right?", next: 20 },
        { text: "B. Quickly walk the opposite direction to get away from that crazy bitch.", next: 21 },
      ],
    },
    {
      id: 11,
      question: "You successfully disarm her and the old lady falls down to the ground. You notice a pocket watch fall out of her bag. Do you–",
      options: [
        { text: "A. Pick up the watch.", next: 22 },
        { text: "B. Ignore the watch and run.", next: 21 },
      ],
    },
    {
      id: 12,
      question: "You go through Door 1 and all of a sudden you are surrounded by mirrors. Do you–",
      options: [
          { text: "A. Check yourself out. Only so many chances to see yourself from this many angles.", next: 8 },
          { text: "B. Use your fists to try and shatter as many mirrors as possible. There must be a way out.", next: 9 },  
      ],
    },
    {
      id: 13,
      question: "You go through Door 2 and you spot a journal and a baseball bat. Do you–",
      options: [
          { text: "A. Read what's in the journal.", next: 24 },
          { text: "B. Pick up the baseball bat.", next: 25 },  
      ],
    },
    {
      id: 14,
      question: "The hand hoists you up out of the hole and your eyes meet a handsome man who appears to be in his late 20s. Do you–",
      options: [
          { text: "A. Smile and start flirting with him.", next: 26 },
          { text: "B. Thank him for his help and walk the other way. You've got no time to waste.", next: 27 },  
      ],
    },
    {
      id: 15,
      question: "You ignore the hand and climb out of the hole, the hand's owner nowhere to be found. You look ahead and two doors have appeared.",
      options: [
          { text: "A. Enter Door 1.", next: 12 },
          { text: "B. Enter Door 2.", next: 13 },  
      ],
    },
    {
      id: 16,
      question: "The mirrors appreciate your iconic dance moves and would like to reward you with picking the next song. Do you–",
      options: [
          { text: "A. Pick a rock ballad you can scream along to.", next: 30 },
          { text: "B. Pick a country song you can hoe down to.", next: 29 },  
      ],
    },
    {
      id: 17,
      question: "You find a hidden button and the music shuts off and a mirror slides open to reveal a hallway with two doors. Do you–",
      options: [
          { text: "A. Enter Door 1", next: 28 },
          { text: "B. Enter Door 2", next: 13 },  
      ],
    },
    {
      id: 18,
      question: "The computer contains a blue folder and a yellow folder. Do you–",
      options: [
          { text: "A. Click on the blue folder.", next: 31 },
          { text: "B. Click on the yellow folder.", next: 30 },  
      ],
    },
    {
      id: 19,
      question: "You enter the next room and see a journal and a baseball bat.",
      options: [
          { text: "A. Read what's in the journal.", next: 24 },
          { text: "B. Pick up the baseball bat.", next: 25 },  
      ],
    },
    {
      id: 20,
      question: "Wrong. The old lady notices you following her and turns around and shoots you. Any last words?",
      options: [
          { text: "A. It is what it is.", next: 31 },
          { text: "B. That bitch.", next: 29 },  
      ],
    },
    {
      id: 21,
      question: "You successfully get away and spot a metal chest on the ground. You open it and spot a journal and a baseball bat.",
      options: [
          { text: "A. Read what's in the journal.", next: 24 },
          { text: "B. Pick up the baseball bat.", next: 25 },  
      ],
    },
    {
      id: 22,
      question: "You pick up the watch and are suddenly transported into a room with a single computer on the ground and a door.",
      options: [
          { text: "A. Investigate what's on the computer.", next: 18 },
          { text: "B. Go through the door.", next: 19 },
      ],
    },
    {
      id: 24,
      question: "The journal contains two phrases. Which are you drawn to?",
      options: [
          { text: "A. How much of my time is really worth the waiting?", next: 30 },
          { text: "B. Sorry if I’ve grown to be someone who doesn’t fit your bounds.", next: 31 },
      ],
    },
    {
      id: 25,
      question: "You pick up the baseball bat and an old radio appears, playing a country song.",
      options: [
          { text: "A. Smash the radio. You hate anything remotely close to country music.", next: 30 },
          { text: "B. Put the baseball down and start grooving.", next: 29 },
      ],
    },
    {
      id: 26,
      question: "The man appreciates your flirting but does not acknowledge it. He holds out his hands, fists closed down, and says 'Pick a hand. Any hand!'",
      options: [
          { text: "A. Pick the left hand.", next: 30 },
          { text: "B. Pick the right hand.", next: 29 },
      ],
    },
    {
      id: 27,
      question: "You come across a metal chest on the ground. You open it and spot a journal and a baseball bat.",
      options: [
          { text: "A. Read what's in the journal.", next: 24 },
          { text: "B. Pick up the baseball bat.", next: 25 },  
      ],
    },
    {
      id: 28,
      question: "You enter a room with a computer on the ground and a door.",
      options: [
          { text: "A. Investigate what's on the computer.", next: 18 },
          { text: "B. Keep exploring, this room doesn't seem to have what you need.", next: 19 },
      ],
    },
    // Final results
    { id: 29, result: "ISHOULDAKNOWN" },
    { id: 30, result: "FILINGCABINET" },
    { id: 31, result: "CONDITIONALLOVE" }
  ];
  