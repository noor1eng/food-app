"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Gauge,
  Star,
  Eye,
  Heart,
  Share2,
  ChefHat,
  MessageCircle,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// const RECIPE = {
//   title: "Creamy Chicken Pasta",
//   description:
//     "A rich and comforting pasta dish featuring tender grilled chicken tossed in a silky parmesan cream sauce. Ready in under 30 minutes, it's the kind of weeknight dinner that feels like a treat — simple ingredients, big flavor.",
//   category: "Pasta",
//   time: "20 min",
//   difficulty: "Easy",
//   rating: 4.8,
//   ratingCount: 245,
//   views: 1240,
//   coverImage:
//     "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?q=80&w=1200&auto=format&fit=crop",
//   author: {
//     name: "Noor Al-Amin",
//     avatar: "https://i.pravatar.cc/64?img=13",
//   },
//   ingredients: [
//     "200g pasta",
//     "2 chicken breasts, sliced",
//     "1 cup heavy cream",
//     "1/2 cup parmesan cheese, grated",
//     "2 cloves garlic, minced",
//     "1 tbsp olive oil",
//     "Salt & black pepper to taste",
//     "Fresh parsley, chopped",
//   ],
//   instructions: [
//     "Cook the pasta according to package instructions. Drain and set aside.",
//     "Season chicken slices with salt and pepper. Grill until golden and cooked through, then set aside.",
//     "In the same pan, sauté garlic in olive oil until fragrant.",
//     "Pour in the heavy cream and bring to a gentle simmer. Stir in the parmesan until melted and smooth.",
//     "Add the pasta and chicken back into the pan, tossing to coat evenly in the sauce.",
//     "Garnish with fresh parsley and extra parmesan before serving.",
//   ],
// };

const INITIAL_COMMENTS = [
  {
    id: 1,
    name: "Sarah Ibrahim",
    avatar: "https://i.pravatar.cc/64?img=32",
    rating: 5,
    date: "2 days ago",
    text: "Made this last night and it was gone in minutes! The sauce is incredibly rich without being heavy.",
    likes: 12,
  },
  {
    id: 2,
    name: "Omar Khaled",
    avatar: "https://i.pravatar.cc/64?img=47",
    rating: 4,
    date: "5 days ago",
    text: "Great recipe overall. I added a bit of chili flakes for some heat and it worked really well.",
    likes: 6,
  },
];

function StarRating({ value, onChange, size = 18, interactive = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = interactive
          ? n <= (hover || value)
          : n <= Math.round(value);
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(n)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onChange && onChange(n)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <Star
              size={size}
              className={
                filled ? "text-[#ffa71c] fill-[#ffa71c]" : "text-stone-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

export default function RecipeDetailsPage() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [recipe, setRecipe] = useState([]);
  const [saved, setSaved] = useState(false);
  const id = useParams().id; // Assuming you have a way to get the recipe ID from the URL

  useEffect(() => {
    try {
      async function fetchRecipeDetails() {
        await axios
          .get(`http://localhost:5000/api/v1/recipe/${id}`)
          .then((response) => {
            setRecipe(response.data);
          });
      }
      fetchRecipeDetails();
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  }, [id]);

  const avgRating = useMemo(() => {
    if (comments.length === 0) return recipe.rating;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    return (sum / comments.length).toFixed(1);
  }, [comments]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || userRating === 0) return;
    const newComment = {
      id: Date.now(),
      name: "You",
      avatar: "https://i.pravatar.cc/64?img=68",
      rating: userRating,
      date: "Just now",
      text: commentText.trim(),
      likes: 0,
    };
    setComments([newComment, ...comments]);
    setCommentText("");
    setUserRating(0);
  };

  async function handleEditFavorate(id) {
    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("description", recipe.description);
    formData.append("category", recipe.category);
    formData.append("time", recipe.time);
    formData.append("difficulty", recipe.difficulty);
    formData.append("ingrediaint", recipe.ingrediaint);
    formData.append("instructions", recipe.instructions);
    formData.append("favorate", true);
    try {
      await axios
        .put(`http://localhost:5000/api/v1/recipe/${id}`, formData)
        .then((res) => {
          console.log(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className="w-full bg-[#f7f7f7] text-stone-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* Cover + title */}
        <div className="relative rounded-3xl overflow-hidden mb-8">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
            <Image
              src={`http://localhost:5000/images/${encodeURIComponent(recipe.coverImage)}`}
              alt={recipe.title || ""}
              fill
              unoptimized
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-800 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
              {recipe.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditFavorate(recipe._id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur transition-colors ${
                  saved
                    ? "bg-[#ffa71c] text-stone-900"
                    : "bg-white/90 text-stone-700 hover:bg-white"
                }`}
              >
                <Heart size={16} className={saved ? "fill-stone-900" : ""} />
              </button>
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-8 sm:right-8">
            <h1
              className="text-[26px] sm:text-[38px] leading-tight text-white max-w-2xl"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 pb-6 border-b border-stone-200">
          <div className="hidden sm:block w-px h-8 bg-stone-200" />

          <span className="inline-flex items-center gap-1.5 text-[13px] text-stone-600">
            <Clock size={15} className="text-stone-400" /> {recipe.time}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-stone-600">
            <Gauge size={15} className="text-stone-400" /> {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-stone-600">
            <Eye size={15} className="text-stone-400" /> views
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-stone-600">
            <StarRating value={Number(avgRating)} size={14} />
            <span className="font-semibold text-stone-800">{avgRating}</span>
            <span className="text-stone-400">({comments.length} reviews)</span>
          </span>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          {/* Left: description + instructions */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2
                className="text-[19px] text-stone-900 mb-3"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
              >
                About this recipe
              </h2>
              <p className="text-[14.5px] text-stone-600 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            <div>
              <h2
                className="text-[19px] text-stone-900 mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
              >
                Instructions
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-stone-900 text-white text-[13px] font-bold flex items-center justify-center"></span>
                  <p className="text-[14px] text-stone-600 leading-relaxed pt-1">
                    {recipe.instructions}
                  </p>
                </li>
              </ol>
            </div>
          </div>

          {/* Right: ingredients */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 lg:sticky lg:top-24">
              <h3
                className="text-[16px] text-stone-900 mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
              >
                Ingredients
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffa71c] shrink-0" />
                  <span className="text-[13.5px] text-stone-600">
                    {recipe.ingredients}
                  </span>
                </li>
              </ul>

              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-stone-400">Rate this recipe</p>
                  <StarRating
                    value={userRating}
                    onChange={setUserRating}
                    interactive
                    size={18}
                  />
                </div>
                <ChefHat size={20} className="text-[#ffa71c]" />
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={18} className="text-stone-700" />
            <h2
              className="text-[20px] text-stone-900"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              Reviews & Comments
            </h2>
            <span className="text-[13px] text-stone-400">
              ({comments.length})
            </span>
          </div>

          {/* New comment form */}
          <form
            onSubmit={handleSubmitComment}
            className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-[13px] font-semibold text-stone-700">
                Your rating
              </label>
              <StarRating
                value={userRating}
                onChange={setUserRating}
                interactive
                size={18}
              />
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts on this recipe..."
              rows={3}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-[#ffa71c] focus:ring-4 focus:ring-[#ffa71c]/10 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!commentText.trim() || userRating === 0}
                className="inline-flex items-center gap-1.5 bg-[#ffa71c] text-stone-900 text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-[#ff9c00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Post Comment <Send size={13} />
              </button>
            </div>
          </form>

          {/* Comment list */}
          <div className="space-y-5">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-stone-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={c.name}
                    />
                    <div>
                      <p className="text-[13.5px] font-semibold text-stone-800">
                        {c.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating value={c.rating} size={12} />
                        <span className="text-[11px] text-stone-400">
                          {c.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[13.5px] text-stone-600 leading-relaxed mt-3.5">
                  {c.text}
                </p>

                <button className="inline-flex items-center gap-1.5 text-[12px] text-stone-400 hover:text-[#a95f00] transition-colors mt-3.5">
                  <ThumbsUp size={13} /> Helpful ({c.likes})
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
