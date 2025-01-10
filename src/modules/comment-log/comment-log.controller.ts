import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentLogService } from './comment-log.service';

@Controller('comment-log')
export class CommentLogController {
  constructor(private commentLogService: CommentLogService) {}

  @Post()
  async createCommentLog(@Body() body: any) {
    return this.commentLogService.create(body);
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.commentLogService.getById(id);
  }
}
