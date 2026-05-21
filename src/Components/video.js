import video1 from "../assets/videos/video1.mp4";
import video2 from "../assets/videos/video2.mp4";
import video3 from "../assets/videos/video3.mp4";
import video4 from "../assets/videos/video4.mp4";

import photo1 from "../assets/photos/photo1.jpg";
import photo2 from "../assets/photos/photo2.jpg";
import photo3 from "../assets/photos/photo3.jpg";
import photo4 from "../assets/photos/photo4.jpg";

const videos = [
  {
    id: "project-1",
    videoName: "Project 1",
    description: "Smooth motion with focused composition.",
    videoSrc: video1,
    prevImage: photo1,
    position: { left: "24%", top: "35%", rotate: "-4deg" },
  },
  {
    id: "project-2",
    videoName: "Project 2",
    description: "Clean pacing with polished details.",
    videoSrc: video2,
    prevImage: photo2,
    position: { left: "64%", top: "35%", rotate: "3deg" },
  },
  {
    id: "project-3",
    videoName: "Project 3",
    description: "Balanced visuals with gentle movement.",
    videoSrc: video3,
    prevImage: photo3,
    position: { left: "37%", top: "75%", rotate: "-2deg" },
  },
  {
    id: "project-4",
    videoName: "Project 4",
    description: "Calm rhythm with strong framing.",
    videoSrc: video4,
    prevImage: photo4,
    position: { left: "77%", top: "77%", rotate: "5deg" },
  },
];

export default videos;
