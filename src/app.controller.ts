import { Controller, Get, Post, Put, Delete, Patch, Head, Options, Query, Param, Body, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('generate-users')
  async generateUsers(@Query('count') count: string) {
    const numCount = parseInt(count, 10);
    const result = await this.appService.generateFakeUsers(numCount);
    return {
      message: `${numCount} fake users generated successfully!`,
      users: result,
    };
  }
  
  @Get('generate-articles')
  async generateArticles(@Query('count') count: string) {
    const numCount = parseInt(count, 10);
    const result = await this.appService.generateFakeArticlesForAllUsers(numCount);
    return {
      message: `Fake posts generated successfully for all users!`,
      articles: result,
    };
  }
}
