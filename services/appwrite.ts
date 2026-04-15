import { Client, Databases, ID, Models, Query } from "react-native-appwrite";

// 1. Configuration from your .env
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;

// 2. Client Initialization
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setPlatform("com.salony.cinenative"); // Matches your app.json package

const database = new Databases(client);

// 3. Types
export interface TrendingMovie extends Models.Document {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

// 4. Update Search Count (The "Trending" Logic)
export const updateSearchCount = async (query: string, movie: any) => {
  if (!query || !movie) return;

  try {
    // Check if the search term already exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", [query.toLowerCase().trim()]),
    ]);

    if (result.documents.length > 0) {
      // If it exists, increment the count
      const existingDoc = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingDoc.$id,
        {
          count: (existingDoc.count || 1) + 1,
        },
      );
    } else {
      // If new, create a new document
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query.toLowerCase().trim(),
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image",
      });
    }
  } catch (error) {
    console.error("Appwrite Update Error:", error);
  }
};

// 5. Get Trending Movies (Top 5)
export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Appwrite Fetch Error:", error);
    return [];
  }
};
