import { Injectable, Inject } from "@nestjs/common";
import { ConfigDTO } from "./dto/config.dto";

@Injectable()
export class ConfigHandlerService {
    private _monitorUrl: string = "http://localhost:3400";
    private _databaseUrl: string = "http://localhost:3000";
    private _breakerType: string = "consecutive";
    private _timeoutDuration: number = 10000;
    private _monitorDuration: number = 10000;
    private _threshold: number = 0.5;
    private _minimumRequests: number = 1;
    private _consecutiveFailures: number = 3;
   

    setBreakerConfig(breakerConfig : ConfigDTO) {
        this.breakerType = breakerConfig.breaker;
        this.timeoutDuration = breakerConfig.timeoutDuration;
        if (this.breakerType == "consecutive") {                     
            this.consecutiveFailures = breakerConfig.consecutiveFailures;
        } else {
            this.monitorDuration = breakerConfig.monitorDuration;
            this.threshold = breakerConfig.threshold;
            this.minimumRequests = breakerConfig.minimumRequests;
        }
        console.log(this.breakerType, this.timeoutDuration, this.consecutiveFailures);
    }

    
    public get monitorUrl(): string {
        return this._monitorUrl;
    }
    public set monitorUrl(value: string) {
        this._monitorUrl = value;
    }
    public get databaseUrl(): string {
        return this._databaseUrl;
    }
    public set databaseUrl(value: string) {
        this._databaseUrl = value;
    }
    public get breakerType(): string {
        return this._breakerType;
    }
    public set breakerType(value: string) {
        this._breakerType = value;
    }
    public get timeoutDuration(): number {
        return this._timeoutDuration;
    }
    public set timeoutDuration(value: number) {
        this._timeoutDuration = value;
    }
    public get monitorDuration(): number {
        return this._monitorDuration;
    }
    public set monitorDuration(value: number) {
        this._monitorDuration = value;
    }
    public get threshold(): number {
        return this._threshold;
    }
    public set threshold(value: number) {
        this._threshold = value;
    }
    public get minimumRequests(): number {
        return this._minimumRequests;
    }
    public set minimumRequests(value: number) {
        this._minimumRequests = value;
    }
    public get consecutiveFailures(): number {
        return this._consecutiveFailures;
    }
    public set consecutiveFailures(value: number) {
        this._consecutiveFailures = value;
    }  
}