import {Body, Controller, Get, Header, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import {FileFetcher} from "./fetchers/file.fetcher";
import {TelegramService} from "nestjs-telegram";

@Controller('/api/v1/soter')
export class SoterController {
    constructor(
        private readonly fileFetcher: FileFetcher,
        private readonly telegram: TelegramService,
    ) {}
    @Get('/telegram/test')
    public async telegramTest(@Res() res: Response) {
        const result = await this.telegram.sendMessage({ chat_id: '-330731984', text: 'Test in Nest js!' }).toPromise();
        console.log(result);
        return res.status(200).send({message: 'ok'});
    }

    @Get('/entities/:cid')
    public async getEntities(@Param('cid') cid: string, @Res() res: Response) {
        try {
            const entities = await this.fileFetcher.getEntities(cid);
            return res.status(200).send(entities);
        } catch (e) {
            return res.status(400).send({message: e.message});
        }
    }

    @Get('/all/:cid')
    public async getAll(@Param('cid') cid: string, @Res() res: Response) {
        try {
            const entities = await this.fileFetcher.getAllFiles(cid);
            return res.status(200).send(entities);
        } catch (e) {
            return res.status(400).send({message: e.message});
        }
    }
}
