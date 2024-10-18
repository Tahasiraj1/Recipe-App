"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Heart, 
  BookHeart, 
  ChefHat, 
  Dot, 
  Linkedin, 
  Instagram, 
  Github,
  ChevronRight,
  ChevronLeft,
  BookOpenText,
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ClipLoader } from "react-spinners";



interface Recipe {
  uri: string;
  label: string;
  image: string;
  ingredientLines: string[];
  ingredients: { text: string }[];
  url: string;
}

const RecipesComponent = () => {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<Recipe[]>([]);
  const [showFavourites, setShowFavourites] = useState<boolean>(false);
  const [pageFrom, setPageFrom] = useState<number>(0);
  const [pageTo, setPageTo] = useState<number>(12);


  const handleNextPage = () => {
    setPageFrom(pageFrom + 12);
    setPageTo(pageTo + 12);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    setPageFrom(pageFrom - 12);
    setPageTo(pageTo - 12);
  };


  const handleShowFavourite = () => {
    if (showFavourites) {
      setShowFavourites(false);
    } else {
      setShowFavourites(true);
    }
  };

  const toggleFavourites = (recipe: Recipe) => {
    const isAlreadyFavourite = favourites.some((fav) => fav.uri === recipe.uri);
    if (isAlreadyFavourite) {
      setFavourites(favourites.filter((fav) => fav.uri !== recipe.uri));
    } else {
      setFavourites([...favourites, recipe]);
    }
  };

  const handleSearch = async () => {
      setLoading(true);
      setSearched(true);
      setRecipes([]);
      try {
          const response = await fetch(
              `https://api.edamam.com/search?q=${query}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`
          );
          const data = await response.json();
          setRecipes(data.hits.map((hit: { recipe: Recipe }) => hit.recipe));
      } catch (error) {
          console.error("Error fetching recipes:", error);
      } finally {
          setLoading(false);
      }
  };

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setSearched(true);
    setRecipes([]);
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=random&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}&from=${pageFrom}&to=${pageTo}`
      );
      const data = await response.json();
      setRecipes(data.hits.map((hit: { recipe: Recipe }) => hit.recipe));
    } catch (error) {
      console.error("Error fetching random recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRecipes();
  }, [pageFrom, pageTo]);

  const handleProfileViews = (Link: string): void => {
    window.open(Link);
  };


  return (
    <>
    <header className='h-20 bg-orange-300 flex justify-between items-center text-orange-700 font-bold'>
    <Link href="/" onClick={() => setShowFavourites(false)}>
      <h1 className='text-4xl m-2 flex items-center gap-1'
        onClick={fetchRandomRecipes}
      >
        <ChefHat className='-translate-y-1' size={40} />
        Cookify
      </h1>
    </Link>
      <div className='relative flex'>
        <Input
          type='text'
          placeholder='Search.'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-32 md:w-56 rounded-full text-black pr-8 ml-0.5 bg-orange-100'
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearch}
          className='absolute right-10 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-transparent'
        >
          <Search className='text-black active:scale-90 transition-transform duration-300' />
        </Button>
        <Button
        variant="ghost"
        size="icon"
        className='mr-0.5 hover:bg-transparent hover:text-orange-700 hover:scale-105 active:scale-95 transition-transform duration-300'
        onClick={handleShowFavourite}
        >
          {showFavourites ? (
            <BookOpenText size={40} />
          ) : (
            <BookHeart size={40} />
          )}
      </Button>
      </div>
    </header>
    <div className="flex flex-col min-h-screen justify-center items-center h-full w-full mx-auto p-4 lg:px-20 lg:py-5 bg-orange-50">
            {/* Loading spinner */}
            {loading ? (
                <div className="flex flex-col justify-center items-center w-full h-screen">
                    <ClipLoader className="w-10 h-10 mb-4" />
                    <p>Loading recipes, please wait...</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Message for no recipes found */}
                    {searched && recipes.length === 0 && (
                      <p>No recipes found, Try searching with different ingredients.</p>
                    )}
                    {/* Message for no favourite recipes found */}
                    {showFavourites && favourites.length === 0 && (
                      <p>No favourite recipes found.</p>
                    )}
                    {/* Show list of favourite recipes */}
                    {showFavourites ? (
                      favourites.map((recipe) =>  (
                        <Card className='group relative shadow-lg' key={recipe.uri}>
                          <Link href={recipe.url} prefetch={false}>
                            <Image
                            src={recipe.image}
                            alt={recipe.label}
                            width={400}
                            height={300}
                            className='object-cover w-full h-48 group-hover:opacity-50 transition-opacity'
                            />
                          </Link>
                          <CardContent className='p-4'>
                            <div className='flex justify-between'>
                              <Link href={recipe.url} prefetch={false}>
                                <h2 className='text-xl font-bold mb-2'>
                                  {recipe.label}
                                </h2>
                              </Link>
                              <Button
                              variant="ghost"
                              size="icon"
                              className='-translate-y-2 hover:bg-transparent hover:scale-125 active:scale-90 transition-transform transform duration-300'
                              onClick={() => toggleFavourites(recipe)}
                              >
                                {favourites.some((fav) => fav.uri === recipe.uri) ? (
                                  <Heart className='text-red-600' fill='red' />
                                ) : (
                                  <Heart />
                                )}
                              </Button>
                            </div>
                            <p className='text-muted-foreground line-clamp-2'>
                              {recipe.ingredientLines.join(", ")}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      // list of recipes
                      recipes.map((recipe) => (
                        <Card className='group relative shadow-lg' key={recipe.uri}>
                          <Link href={recipe.url} prefetch={false}>
                            <Image
                            src={recipe.image}
                            alt={recipe.label}
                            width={400}
                            height={300}
                            className='object-cover w-full h-48 group-hover:opacity-50 transition-opacity'
                            />
                          </Link>
                          <CardContent className='p-4'>
                            <div className='flex justify-between'>
                              <Link href={recipe.url} prefetch={false}>
                                <h2 className='text-xl font-bold mb-2'>
                                  {recipe.label}
                                </h2>
                              </Link>
                              <Button
                              variant="ghost"
                              size="icon"
                              className='-translate-y-2 hover:bg-transparent hover:scale-125 active:scale-90 transition-transform transform duration-300'
                              onClick={() => toggleFavourites(recipe)}
                              >
                                {favourites.some((fav) => fav.uri === recipe.uri) ? (
                                  <Heart className='text-red-600' fill='red' />
                                ) : (
                                  <Heart />
                                )}
                              </Button>
                            </div>
                            <p className='text-muted-foreground line-clamp-2'>
                              {recipe.ingredientLines.join(", ")}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                </div>
            )}
            {showFavourites === false && (
              <div className='flex flex-row justify-center items-center gap-2 mt-5'>
              <Button
              size="icon"
              onClick={handlePreviousPage}
              disabled={pageFrom === 0}
              className='bg-orange-700 rounded-full active:scale-90 transition-transform duration-300'
              >
                <ChevronLeft />
              </Button>
              <Button
              size="icon"
              disabled={pageFrom === 96}
              onClick={handleNextPage}
              className='bg-orange-700 rounded-full active:scale-90 transition-transform duration-300'
              >
                <ChevronRight />
              </Button>
              </div>
            )}
        </div>
        <footer className='font-sans flex flex-col justify-center items-center h-20 bg-orange-300'>
        <div className='flex flex-row pt-2 font-semibold'>
        <span>&copy; 2024</span>
        <Dot /><span>Recipea</span>
        <Dot /><span>All rights reserved</span>
        </div>
        <div className='flex flex-row'>
          <Button
          onClick={() => handleProfileViews("https://www.linkedin.com/in/taha-siraj-521b512b7/")}
          className='bg-inherit text-orange-800 hover:bg-transparent'
          >
            <Linkedin className='hover:text-black active:scale-95 transition-transform transform duration-300' />
          </Button>
          <Button
          onClick={() => handleProfileViews("https://github.com/Tahasiraj1")}
          className='bg-inherit text-orange-800 hover:bg-transparent'
          >
            <Github  className='hover:text-black active:scale-95 transition-transform transform duration-300 ' />
          </Button>
          <Button
          onClick={() => handleProfileViews("https://www.instagram.com/taha__siraj/")}
          className='bg-inherit text-orange-800 hover:bg-transparent'
          >
            <Instagram className='hover:text-black active:scale-95 transition-transform transform duration-300 ' />
          </Button>
        </div>
    </footer>
    </>
  );
}

export default RecipesComponent;

