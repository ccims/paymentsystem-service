import { Injectable, Inject } from "@nestjs/common";
import { ConfigDTO } from "./dto/config.dto";
import { AppService } from "../app.service";

import { ConfigModule, ConfigService } from "@nestjs/config"
/**
 * Contains handling of config changes and the access to the
 * configuration variables
 */
@Injectable()
export class ConfigHandlerService {
  // url for the requests to the monitor
  private _monitorUrl: string;
  //values of the breaker config
  private _breakerType: string = 'consecutive';
  private _resetDuration: number = 10000;
  private _timeoutDuration: number = 10000;
  private _monitorDuration: number = 10000;
  private _threshold: number = 0.5;
  private _minimumRequests: number = 1;
  private _consecutiveFailures: number = 3;


  constructor(private readonly configService: ConfigService) {
    this.monitorUrl = configService.get<string>("BACKEND_RESPONSE_MONITOR_URL", "http://localhost:3400");
  }

  /**
   * Receives the configuration for the circuitBreaker via Put call.
   * Updates the config values and sets the configWasUpdate var to true
   * @param breakerConfig
   */
  setBreakerConfig(breakerConfig: ConfigDTO) {
    this.breakerType = breakerConfig.breaker;
    this.resetDuration = breakerConfig.resetDuration;
    this.timeoutDuration = breakerConfig.timeoutDuration;
    if (this.breakerType == 'consecutive') {
      this.consecutiveFailures = breakerConfig.consecutiveFailures;
    } else {
      this.monitorDuration = breakerConfig.monitorDuration;
      this.threshold = breakerConfig.threshold;
      this.minimumRequests = breakerConfig.minimumRequests;
    }
  }

  // getter and setter
  public get monitorUrl(): string {
    return this._monitorUrl;
  }
  public set monitorUrl(value: string) {
    this._monitorUrl = value;
  }
  public get breakerType(): string {
    return this._breakerType;
  }
  public set breakerType(value: string) {
    this._breakerType = value;
  }
  public get resetDuration(): number {
    return this._resetDuration;
  }
  public set resetDuration(value: number) {
    this._resetDuration = value;
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
