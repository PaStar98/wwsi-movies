import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { movie_id, score } = body;

        // Basic validation
        if (!movie_id || score === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const scoreInt = Number(score);
        if (isNaN(scoreInt) || scoreInt < 1 || scoreInt > 5) {
            return NextResponse.json({ error: 'Score must be between 1 and 5' }, { status: 400 });
        }

        const rating = await prisma.rating.create({
            data: {
                score: scoreInt,
                movieId: Number(movie_id),
            },
        });

        return NextResponse.json(rating, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to add rating' }, { status: 500 });
    }
}
