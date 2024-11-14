import { Controller, Get, Post, Put, Delete, Patch, Head, Options, Query, Param, Body, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
}
