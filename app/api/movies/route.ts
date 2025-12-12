import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type MovieWithRatings = Prisma.MovieGetPayload<{
    include: { ratings: true }
}>;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const where = year ? { year: parseInt(year) } : {};

    const movies = await prisma.movie.findMany({
        where,
        include: {
            ratings: true,
        },
    });

    const modeledMovies = movies.map((movie: MovieWithRatings) => {
        const totalScore = movie.ratings.reduce((acc: number, r) => acc + r.score, 0);
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
    modeledMovies.sort((a, b) => b.avg_score - a.avg_score);

    return NextResponse.json(modeledMovies);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, year } = body;

        if (!title || !year) {
            return NextResponse.json({ error: 'Title and year are required' }, { status: 400 });
        }

        const movie = await prisma.movie.create({
            data: {
                title,
                year: Number(year),
            },
        });

        return NextResponse.json(movie, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
    }
}
