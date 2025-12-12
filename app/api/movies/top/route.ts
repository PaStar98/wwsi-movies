import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type MovieWithRatings = Prisma.MovieGetPayload<{
    include: { ratings: true }
}>;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    // Default limit 5 if not specified, though usually limit is optional but the route is "top" so it implies a subset.
    const limit = limitParam ? parseInt(limitParam) : 10;

    const movies = await prisma.movie.findMany({
        include: {
            ratings: true,
        },
    });

    const modeledMovies = movies.map((movie: MovieWithRatings) => {
        const totalScore = movie.ratings.reduce((acc: number, r: Prisma.RatingGetPayload<{}>) => acc + r.score, 0);
        const count = movie.ratings.length;
        const avg_score = count > 0 ? totalScore / count : 0;

        return {
            id: movie.id,
            title: movie.title,
            year: movie.year,
            avg_score: Number(avg_score.toFixed(2)),
            votes: count,
        };
    });

    // Sort descending by avg_score
    modeledMovies.sort((a: { avg_score: number }, b: { avg_score: number }) => b.avg_score - a.avg_score);

    // Apply limit
    const topMovies = modeledMovies.slice(0, limit);

    return NextResponse.json(topMovies);
}
