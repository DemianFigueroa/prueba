import Link from 'next/link';
import { Star } from 'lucide-react';
import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import LogoutButton from './api/logout/LogoutButton';
const deletePost = async (id: string) => {
  'use server';
  await prisma.post.delete({ where: { id } });
  revalidatePath('/');
};

const createPost = async (formData: FormData) => {
  'use server';
  const name = formData.get('name') as string;
  await prisma.post.create({ data: { name } });
  revalidatePath('/');
};

// New: toggleFavorite in the same file
const toggleFavorite = async (id: string) => {
  'use server';
  // fetch current value
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;
  // flip it
  await prisma.post.update({
    where: { id },
    data: { favorite: !post.favorite },
  });
  revalidatePath('/');
};

const Home = async () => {
  const posts = await prisma.post.findMany();

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">Mis Anuncios</h1>
      <LogoutButton />
      <form action={createPost} className="flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Nuevo título…"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
        >
          Crear
        </button>
      </form>

      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li
            key={post.id}
            className={`
              py-4
              ${post.favorite ? 'bg-yellow-50' : ''}
            `}
          >
            <div className="p-4 bg-white shadow-sm rounded-lg flex justify-between items-center">
              <span className="font-medium text-gray-800">{post.name}</span>
              <div className="flex space-x-3 items-center">
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="text-yellow-600 hover:underline"
                >
                  Editar
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </form>
                {/* Favorite toggle */}
                <form action={toggleFavorite.bind(null, post.id)}>
                  <button type="submit" className="flex items-center">
                    {post.favorite ? (
                      <Star className="w-5 h-5 text-yellow-500 hover:text-yellow-600" fill="currentColor" />
                    ) : (
                      <Star className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;