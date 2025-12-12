# Movies Ranking App (Lab04)

Aplikacja do rankingu filmów stworzona w **Next.js**, **Prisma (SQLite)** i **TypeScript**.

## Wymagania

- Node.js (wersja 18+ zalecana)
- npm

## Instalacja i Uruchomienie

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Stwórz plik .env w głównym katalogu i dodaj do niego 
    ```bash
    DATABASE_URL="file:./dev.db"
    ```

3. **Przygotuj bazę danych:**
   Komenda ta stworzy plik bazy danych SQLite (`dev.db`) i zaaplikuje migracje.
   ```bash
   npx prisma migrate dev
   ```

4. **Uruchom serwer deweloperski:**
   ```bash
   npm run dev
   ```

5. **Otwórz aplikację:**
   Wejdź na stronę [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Funkcjonalności

- **Dodawanie filmów**: Formularz do dodania tytułu i roku produkcji.
- **Ocenianie**: Możliwość ocenienia filmu w skali 1-5.
- **Ranking**: Lista filmów sortowana automatycznie po średniej ocenie (malejąco).
- **Czas rzeczywisty**: Zmiany widoczne są natychmiastowo po odświeżeniu listy (re-fetch).

## Bonusy (zrealizowane)

- **Filtrowanie po roku**
- **Top 5 filmów**
