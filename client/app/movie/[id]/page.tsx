import BookMoviePage from "@/components/book-movie";

export default function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <BookMoviePage  />;
}
