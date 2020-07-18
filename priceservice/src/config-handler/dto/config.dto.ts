
export interface ConfigDTO {
    breaker : string;
    timeoutDuration : number;
    resetDuration : number;
    monitorDuration : number;
    threshold : number;
    minimumRequests : number;
    consecutiveFailures : number;
}