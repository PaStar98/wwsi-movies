'use client';

import { useState, useEffect } from 'react';

type Movie = {
    id: number;
    title: string;
    year: number;
    avg_score: number;
    votes: number;
};

export default function MovieDashboard() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newMovieTitle, setNewMovieTitle] = useState('');
    const [newMovieYear, setNewMovieYear] = useState('');
    const [ratingInputs, setRatingInputs] = useState<Record<number, number>>({});

    const fetchMovies = async () => {
        // Optimistic or simple re-fetch. Simple re-fetch is safer for consistency.
        try {
            const res = await fetch('/api/movies');
            if (res.ok) {
                const data = await res.json();
                setMovies(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const addMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMovieTitle || !newMovieYear) return;

        try {
            const res = await fetch('/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newMovieTitle, year: parseInt(newMovieYear) }),
            });
            if (res.ok) {
                setNewMovieTitle('');
                setNewMovieYear('');
                fetchMovies();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const rateMovie = async (movieId: number) => {
        const score = ratingInputs[movieId];
        if (score === undefined || score < 1 || score > 5) return;

        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie_id: movieId, score }),
            });
            if (res.ok) {
                // Clear input for this movie
                setRatingInputs(prev => {
                    const next = { ...prev };
                    delete next[movieId];
                    return next;
                });
                fetchMovies();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <header className="glass-panel" style={{ textAlign: 'center' }}>
                <h1>Movies Recommendation</h1>
                <p style={{ opacity: 0.7 }}>Vote for the best movies</p>
            </header>

            {/* Add Movie Form */}
            <section className="glass-panel">
                <h2>Add New Movie</h2>
                <form onSubmit={addMovie} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Title"
                        value={newMovieTitle}
                        onChange={e => setNewMovieTitle(e.target.value)}
                        required
                        style={{ flex: 1, minWidth: '200px' }}
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder="Year"
                        value={newMovieYear}
                        onChange={e => setNewMovieYear(e.target.value)}
                        required
                        style={{ width: '100px' }}
                    />
                    <button className="btn" type="submit">Add Movie</button>
                </form>
            </section>

            {/* Movie List */}
            <section className="glass-panel">
                <h2>Ranking</h2>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '1rem' }}>Loading...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        {movies.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No movies found.</p>}
                        {movies.map(movie => (
                            <div key={movie.id} className="movie-card">
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>{movie.title}</h3>
                                        <span style={{ opacity: 0.5, fontSize: '0.9em' }}>{movie.year}</span>
                                    </div>
                                    <div className="row" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="score-badge" style={{ fontSize: '1.1em' }}>{movie.avg_score.toFixed(2)}</span>
                                            <span style={{ opacity: 0.7 }}>avg</span>
                                        </div>
                                        <span style={{ opacity: 0.4 }}>|</span>
                                        <span style={{ opacity: 0.7 }}>{movie.votes} votes</span>
                                    </div>
                                </div>

                                <div className="row">
                                    <select
                                        className="select"
                                        style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                                        value={ratingInputs[movie.id] || ''}
                                        onChange={e => setRatingInputs({ ...ratingInputs, [movie.id]: parseInt(e.target.value) })}
                                    >
                                        <option value="" disabled>Rate</option>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => rateMovie(movie.id)}
                                        disabled={!ratingInputs[movie.id]}
                                    >
                                        Vote
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
