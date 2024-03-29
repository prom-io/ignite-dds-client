import {Body, Controller, Get, Param, Post, Res} from "@nestjs/common";
import {PasswordHashDto} from "./dto/passwordHash.dto";
import {Response} from "express";
import {NewPasswordHashHandler} from "./useCase/newPasswordHash/newPasswordHash.handler";
import {PasswordHashService} from "./services/passwordHash.service";
import {PasswordHashMainService} from "./services/passwordHashMain.service";
import {PasswordHashContract} from "../binance/contracts/testNet/passwordHash.contract";

@Controller('/api/v1/password')
export class PasswordHashController {

    constructor(
        private readonly handler: NewPasswordHashHandler,
        private readonly passwordHashService: PasswordHashMainService,
        private readonly passwordHashServiceBinance: PasswordHashContract
    ) {}

    @Get('/mainnet/:transactionHash')
    public async getPasswordInMainNetByTransactionHash(
        @Param('transactionHash') transactionHash: string,
        @Res() res: Response,
    ) {
        const hash = await this.passwordHashService.getPasswordByTransactionHash(transactionHash);
        const address = await this.passwordHashService.getFromAddressInTransaction(transactionHash);
        return res.status(200).send({hash, address});
    }

    @Get('/binance-smart-chain/:transactionHash')
    public async getPasswordInBinanceSmartChainByTransactionHash(
        @Param('transactionHash') transactionHash: string,
        @Res() res: Response,
    ) {
        const hash = await this.passwordHashServiceBinance.getPasswordByTransactionHash(transactionHash);
        const address = await this.passwordHashServiceBinance.getFromAddressInTransaction(transactionHash);
        return res.status(200).send({hash, address});
    }

    @Get('/by-tx/:transactionHash')
    public async getPasswordByTx(@Param('transactionHash') transactionHash: string, @Res() res: Response) {
        let address = await this.passwordHashServiceBinance.getFromAddressInTransaction(transactionHash);
        let hash = await this.passwordHashServiceBinance.getPasswordByTransactionHash(transactionHash);

        if (!hash) {
            address = await this.passwordHashService.getFromAddressInTransaction(transactionHash);
            hash = await this.passwordHashService.getPasswordByTransactionHash(transactionHash);
        }

        return res.status(200).send({ hash, address });
    }

    @Post('/hash/set')
    public async changePasswordHash(
        @Body() changePasswordDto: PasswordHashDto,
        @Res() res: Response,
    ) {
        await this.handler.handle(changePasswordDto);
        return res.status(200).send({message: 'To new hash success changed!'});
    }

    @Post('/hash/set-to-ethereum')
    public async setPasswordHash(
        @Body() changePasswordDto: PasswordHashDto,
        @Res() res: Response,
    ) {
        await this.handler.handleForEthereum(changePasswordDto);
        return res.status(200).send({message: 'To new hash success changed!'});
    }

    @Post('/hash/set-to-binance')
    public async setBinancePasswordHash(
        @Body() changePasswordDto: PasswordHashDto,
        @Res() res: Response,
    ) {
        await this.handler.handleForBinance(changePasswordDto);
        return res.status(200).send({message: 'To new hash success changed!'});
    }

    @Get('/hash/:address')
    public async getHash(@Param('address') address: string, @Res() res: Response) {
        const hash = await this.handler.getHashForAddress(address);
        return res.status(200).send({hash});
    }
}
