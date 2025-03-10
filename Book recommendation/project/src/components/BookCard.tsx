import React, { useState } from 'react';
import { Heart, ChevronDown, ChevronUp, Star, StarHalf } from 'lucide-react';
import { Book } from '../types';
import { cn } from '../utils/cn';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (book: Book) => void;
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    );
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
    );
  }

  return <div className="flex">{stars}</div>;
}

export function BookCard({ book, isFavorite, onToggleFavorite }: BookCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { volumeInfo } = book;
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative aspect-[2/3] bg-gray-100">
        {volumeInfo.imageLinks?.thumbnail ? (
          <img
            src={volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}
            alt={volumeInfo.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        <button
          onClick={() => onToggleFavorite(book)}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-md",
            "transition-colors hover:bg-gray-100",
            isFavorite && "text-red-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{volumeInfo.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {volumeInfo.authors?.join(', ') || 'Unknown Author'}
        </p>
        {volumeInfo.averageRating && (
          <div className="flex items-center gap-2 mb-2">
            <RatingStars rating={volumeInfo.averageRating} />
            <span className="text-sm text-gray-600">
              {volumeInfo.averageRating.toFixed(1)}
              {volumeInfo.ratingsCount && ` (${volumeInfo.ratingsCount})`}
            </span>
          </div>
        )}
        {volumeInfo.description && (
          <>
            <p className={cn(
              "text-sm text-gray-700",
              isExpanded ? "" : "line-clamp-3"
            )}>
              {volumeInfo.description}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          {volumeInfo.language && (
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {volumeInfo.language.toUpperCase()}
            </span>
          )}
          {volumeInfo.pageCount && (
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {volumeInfo.pageCount} pages
            </span>
          )}
        </div>
      </div>
    </div>
  );
}