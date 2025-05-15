import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Star } from 'lucide-react';

const toggleFavorite = async (id: string) => {
  'use server';
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;
  await prisma.post.update({
    where: { id },
    data: { favorite: !post.favorite },
  });
  revalidatePath(`/posts/${id}`);
};

const PostPage = async (props: { params: Promise<{ postId: string }> }) => {
  const { postId } = await props.params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-sm rounded-lg p-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          {post.name}
          <form action={toggleFavorite.bind(null, post.id)}>
            <button type="submit" aria-label="Toggle Favorite">
              {post.favorite ? (
                <Star className="w-6 h-6 text-yellow-500 hover:text-yellow-600 transition" fill="currentColor" />
              ) : (
                <Star className="w-6 h-6 text-gray-400 hover:text-gray-600 transition" />
              )}
            </button>
          </form>
        </h2>
      </div>
      <div className="mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al listado
        </Link>
      </div>
    </div>
  );
};

export default PostPage;
