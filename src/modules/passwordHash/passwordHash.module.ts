import {Module} from "@nestjs/common";
import {PasswordHashController} from "./passwordHash.controller";
import {PasswordHashService} from "./services/passwordHash.service";
import {PasswordHashDto} from "./dto/passwordHash.dto";
import {Web3PrivateService} from "./web3Private.service";
import {NewPasswordHashHandler} from "./useCase/newPasswordHash/newPasswordHash.handler";
import {Web3MainNetService} from "./web3MainNet.service";
import {PasswordHashMainService} from "./services/passwordHashMain.service";
import {PasswordHashContract} from "../binance/contracts/testNet/passwordHash.contract";
import {TestNetworkService} from "../binance/services/testNetwork.service";
@Module({
    imports: [],
    controllers: [PasswordHashController],
    providers: [
        PasswordHashService,
        PasswordHashDto,
        Web3PrivateService,
        NewPasswordHashHandler,
        Web3MainNetService,
        PasswordHashMainService,
        PasswordHashContract,
        TestNetworkService,
    ],
})
export class PasswordHashModule {}
