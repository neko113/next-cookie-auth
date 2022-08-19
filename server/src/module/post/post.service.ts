import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostQueryDto } from './dto/find-post-query.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findPostsByQuries({ cursor }: FindPostQueryDto) {
    const size = 20;
    if (!cursor) {
      const posts = await this.prisma.post.findMany({
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      const nextCursor = posts[size - 1]?.id;
      return { posts, nextCursor };
    }
    const posts = await this.prisma.post.findMany({
      take: size,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const nextCursor = posts[size - 1]?.id;

    return { posts, nextCursor };
  }

  async searchPosts(keyword: string) {
    return await this.prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            body: {
              contains: keyword,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async findPostById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async createPost(userId: string, { title, body }: CreatePostDto) {
    return await this.prisma.post.create({
      data: { title, body, userId },
    });
  }

  async likePost({ userId, postId }: PostActionParams) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException();
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException();

    const alreadyLiked = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (!alreadyLiked) {
      await this.prisma.postLike.create({ data: { postId, userId } });
    }
    const postLikes = await this.prisma.postLike.count({
      where: { postId },
    });
    return await this.prisma.post.update({
      data: { likes: postLikes },
      where: { id: postId },
    });
  }

  async unlikePost({ userId, postId }: PostActionParams) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException();
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException();

    const alreadyLiked = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (alreadyLiked) {
      await this.prisma.postLike.delete({
        where: { postId_userId: { postId, userId } },
      });
    }
    const postLikes = await this.prisma.postLike.count({
      where: { postId },
    });
    return await this.prisma.post.update({
      data: { likes: postLikes },
      where: { id: postId },
    });
  }

  async deletePost({ userId, postId }) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    if (post.userId !== userId) throw new UnauthorizedException();
    return await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}

interface PostActionParams {
  userId: string;
  postId: string;
}
