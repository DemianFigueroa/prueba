import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

const updatePost = async (formData: FormData) => {
  'use server';
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;

  if (!id || !name) {
    throw new Error('Missing required form fields.');
  }

  await prisma.post.update({ where: { id }, data: { name } });
  revalidatePath('/');
  redirect('/');
};

const EditPage = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) return notFound();

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-300 mb-6">Editar Post</h2>
      <form action={updatePost} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={post.id} />
        <label className="flex flex-col">
          <span className="mb-1 font-medium text-gray-300">Nombre</span>
          <input
            type="text"
            name="name"
            defaultValue={post.name}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditPage;
