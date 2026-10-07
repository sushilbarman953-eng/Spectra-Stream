"use client";

import React from "react";
import { soundFx } from "@/lib/soundFx";
import { SafeImage } from "@/components/SafeImage";

export interface StarProfile {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  gradient: string;
}

export const INDIAN_MOVIE_STARS: StarProfile[] = [
  {
    id: "srk",
    name: "Shah Rukh Khan",
    role: "King Khan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg",
    gradient: "bg-gradient-to-tr from-amber-500 via-zinc-800 to-red-600",
  },
  {
    id: "prabhas",
    name: "Prabhas",
    role: "Rebel Star",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Prabhas_at_the_Kalki_2898_AD_event.jpg",
    gradient: "bg-gradient-to-tr from-red-600 via-zinc-800 to-orange-500",
  },
  {
    id: "deepika",
    name: "Deepika Padukone",
    role: "Leading Actress",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Deepika_Padukone_Cannes_2018.jpg",
    gradient: "bg-gradient-to-tr from-pink-500 via-zinc-800 to-purple-600",
  },
  {
    id: "jr_ntr",
    name: "N. T. Rama Rao Jr.",
    role: "Man of Masses",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/NTR_Jr._at_an_interview_in_2022.jpg",
    gradient: "bg-gradient-to-tr from-emerald-500 via-zinc-800 to-teal-500",
  },
  {
    id: "ram_charan",
    name: "Ram Charan",
    role: "Mega Power Star",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Ram_Charan_at_RRR_press_meet.jpg",
    gradient: "bg-gradient-to-tr from-orange-500 via-zinc-800 to-yellow-400",
  },
];

export const HOLLYWOOD_MOVIE_STARS: StarProfile[] = [
  {
    id: "tom_cruise",
    name: "Tom Cruise",
    role: "Action Icon",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Tom_Cruise_by_Gage_Skidmore_2.jpg",
    gradient: "bg-gradient-to-tr from-cyan-500 via-zinc-800 to-blue-600",
  },
  {
    id: "cillian_murphy",
    name: "Cillian Murphy",
    role: "Lead Actor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_at_Oppenheimer_premiere.jpg",
    gradient: "bg-gradient-to-tr from-zinc-400 via-zinc-800 to-neutral-200",
  },
  {
    id: "scarlett_johansson",
    name: "Scarlett Johansson",
    role: "Black Widow",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Scarlett_Johansson_by_Gage_Skidmore_2.jpg",
    gradient: "bg-gradient-to-tr from-rose-500 via-zinc-800 to-red-500",
  },
  {
    id: "leonardo_dicaprio",
    name: "Leonardo DiCaprio",
    role: "Academy Winner",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/Leonardo_Dicaprio_Cannes_2019.jpg",
    gradient: "bg-gradient-to-tr from-amber-400 via-zinc-800 to-yellow-600",
  },
];

interface StarSpotlightCapsulesProps {
  title: string;
  subtitle?: string;
  stars: StarProfile[];
}

export const StarSpotlightCapsules: React.FC<StarSpotlightCapsulesProps> = ({
  title,
  subtitle = "Popular Spotlight",
  stars,
}) => {
  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          {title}
        </h2>
        <span className="text-xs font-bold text-zinc-400">{subtitle}</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 px-0.5">
        {stars.map((star) => (
          <div
            key={star.id}
            className="flex-none w-24 sm:w-28 flex flex-col items-center group cursor-pointer"
            onClick={() => soundFx.playCinematicPop()}
          >
            <div
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl overflow-hidden p-0.5 border border-white/20 shadow-xl group-hover:scale-105 group-hover:border-white/40 transition duration-300 ${star.gradient}`}
            >
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-zinc-950">
                <SafeImage
                  src={star.imageUrl}
                  alt={star.name}
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-1.5 inset-x-1 text-center z-20">
                  <h4 className="text-[9px] sm:text-[10px] font-black text-white tracking-tight uppercase line-clamp-1 drop-shadow leading-tight">
                    {star.name}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
